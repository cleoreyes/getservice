import mongoose from "mongoose";

let models = {};

// only happening for one time
main();

async function main() {
  await mongoose.connect(
    "mongodb+srv://INFO441:dkanrjsk123@cluster0.j5bem.mongodb.net/uwservice?retryWrites=true&w=majority&appName=Cluster0",
  );

  console.log("connected");

  const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    profile_picture: {
      data: Buffer,
      contentType: String,
    },
  });

  models.User = mongoose.model("User", userSchema);

  const serviceSchema = new mongoose.Schema({
    username: String,
    useremail: String,
    title: String,
    description: String,
    price: Number,
    created_at: String,
    categories: [String],
    image: {
      data: Buffer,
      contentType: String,
    },
  });

  models.Service = mongoose.model("Service", serviceSchema);

  console.log("model created");

  const reviewSchema = new mongoose.Schema({
    username: String,
    useremail: String,
    review: String,
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    created_date: { type: Date, default: Date.now },
  });

  models.Review = mongoose.model("Review", reviewSchema);
}

export default models;
