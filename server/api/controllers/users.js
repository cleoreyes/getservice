import express from "express";
import multer from "multer";
var router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  const allUsers = await req.models.User.find();
  res.json({ users: allUsers });
});

// GET /api/users/myIdentity
router.get("/myIdentity", async function (req, res, next) {
  if (req.session.isAuthenticated) {
    const userEmail = req.session.account.username;
    const user = await req.models.User.findOne({ email: userEmail });

    if (!user) {
      // Create a new user if none exists
      const newUser = new req.models.User({
        name: req.session.account.name,
        email: userEmail,
        profile_picture:
          "https://github.com/user-attachments/assets/08522b1f-bdec-4656-aac5-734c3bae1a56",
      });
      await newUser.save();
    }

    res.json({
      status: "loggedin",
      userInfo: {
        name: req.session.account.name,
        useremail: req.session.account.username,
      },
    });
  } else {
    res.json({ status: "loggedout" });
  }
});

// GET /api/users/profilePicture
router.get("/profilePicture", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Missing user email" });
    }

    const user = await req.models.User.findOne({ email: email });

    res.set("Content-Type", user.profile_picture.contentType);
    res.send(user.profile_picture.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

// POST /api/users/uploadProfilePicture
router.post(
  "/uploadProfilePicture",
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("Email:", req.query.email);
      console.log("File:", req.file);

      if (!req.query.email) {
        return res.status(400).json({ error: "Missing email" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Missing file" });
      }

      const user = await req.models.User.findOne({ email: req.query.email });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.profile_picture = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };

      await user.save();

      res.json({ message: "Profile picture uploaded successfully" });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  },
);

export default router;
