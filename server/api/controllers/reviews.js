import express from "express";
import models from "../../model.js";

const reviewsRouter = express.Router();

// GET /api/reviews
reviewsRouter.get("/", async (req, res) => {
  try {
    const { serviceName } = req.query;

    if (!serviceName) {
      return res.status(400).json({
        status: "error",
        error: "Service name query parameter is required.",
      });
    }

    const service = await models.Service.findOne({ title: serviceName });

    if (!service) {
      return res.status(404).json({
        status: "error",
        error: "Service not found.",
      });
    }

    const reviews = await models.Review.find({ service: service._id });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// POST /api/reviews
reviewsRouter.post("/", async (req, res) => {
  try {
    const { newReview, serviceName } = req.body;
    const name = req.session.account.name;
    const email = req.session.account.username;

    if (!name) {
      return res.status(401).json({
        status: "error",
        error: "You must be logged in to submit a review.",
      });
    }

    const service = await models.Service.findOne({ title: serviceName });

    if (!service) {
      return res.status(404).json({
        status: "error",
        error: "Service not found.",
      });
    }

    const review = new models.Review({
      username: name,
      review: newReview,
      useremail: email,
      service: service._id,
      created_date: new Date(),
    });

    await review.save();
    res.status(201).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

reviewsRouter.delete("/:id", async (req, res) => {
  try {
    const reviewId = req.params.id;

    if (!reviewId) {
      return res.status(400).json({
        status: "error",
        error: "Review ID required.",
      });
    }

    await models.Review.deleteOne({ _id: reviewId });
    res.json({ status: "success" });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

export default reviewsRouter;
