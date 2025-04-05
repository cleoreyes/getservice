import express from "express";
var router = express.Router();

import servicesRouter from "./controllers/services.js";
import usersRouter from "./controllers/users.js";
import reviewRouter from "./controllers/reviews.js";

router.use("/services", servicesRouter);
router.use("/users", usersRouter);
router.use("/reviews", reviewRouter);

export default router;
