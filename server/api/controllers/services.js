import express from "express";
import multer from "multer";

var router = express.Router();

// Configure multer for file uploads (store in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET /api/services
router.get("/", async (req, res) => {
  try {
    const useremail = req.query.useremail;
    const allServices =
      useremail == undefined || useremail == "" || useremail == null
        ? await req.models.Service.find()
        : await req.models.Service.find({ useremail: useremail });
    res.json({ services: allServices });
  } catch (error) {
    console.log(err);
    res.status(500).json({ status: "error", error: err });
  }
});

// POST /api/services
router.post("/", upload.single("image"), async (req, res) => {
  if (!req.session.isAuthenticated) {
    res.status(401).json({ status: "error", error: "not logged in" });
  }

  const categories = Array.isArray(req.body.categories)
    ? req.body.categories
    : [req.body.categories];

  try {
    // Find the user by their email
    const user = await req.models.User.findOne({
      email: req.session.account.username,
    });

    if (!user) {
      return res.status(404).json({ status: "error", error: "User not found" });
    }

    const newService = new req.models.Service({
      username: req.session.account.name,
      useremail: req.session.account.username,
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      categories: categories,
      created_at: new Date(),
      image: req.file
        ? {
            data: req.file.buffer, // Store image as binary
            contentType: req.file.mimetype, // Store MIME type
          }
        : null, // Store as null if no image provided
    });

    await newService.save();
    res.status(201).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// DELETE /api/services/:id
router.delete("/:id", async (req, res) => {
  try {
    const serviceId = req.params.id;

    if (!serviceId) {
      return res.json({ status: "error", error: "service ID required" });
    }

    const service = await req.models.Service.findById(serviceId);
    console.log("session username", req.session.account.username);
    console.log("service useremail", service.useremail);
    if (!service) {
      return res.json({
        status: "error",
        error: "service not found",
      });
    }

    if (req.session.account.username !== service.useremail) {
      return res.status(403).json({
        status: "error",
        error: "you can only delete your own service",
      });
    }

    await req.models.Review.deleteMany({ service: serviceId });
    await req.models.Service.deleteOne({ _id: serviceId });
    res.json({ status: "success" });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ status: "error", error: error.message });
  }
});

// GET /api/services/image
router.get("/image", async (req, res) => {
  try {
    const id = req.query.id; // Get `_id` from query params

    if (!id) {
      return res.status(400).json({ error: "Missing service ID" });
    }

    // Find service by `_id`
    const service = await req.models.Service.findById(id);

    // console.log('service', service);

    if (!service || !service.image || !service.image.data) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Send the image as binary data
    res.set("Content-Type", service.image.contentType);
    res.send(service.image.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

export default router;
