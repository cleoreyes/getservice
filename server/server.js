import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import models from "./model.js";
import session from "express-session";
import { fileURLToPath } from "url";
import urlRouter from "./api/api.js";
import WebAppAuthProvider from "msal-node-wrapper";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const authConfig = {
  auth: {
    clientId: process.env.CLIENT_ID,
    authority: process.env.AUTHORITY,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: 3,
    },
  },
};

const app = express();

app.enable("trust proxy");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public/build")));

const oneDay = 1000 * 60 * 60 * 24;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  }),
);

const authProvider =
  await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate());

app.use((req, res, next) => {
  req.models = models;
  next();
});

app.use("/api", urlRouter);

app.get("/signin", (req, res, next) => {
  return req.authContext.login({
    postLoginRedirectUri: "https://get-service-ten.vercel.app/",
  })(req, res, next);
});

app.get("/signout", (req, res, next) => {
  return req.authContext.logout({
    postLogoutRedirectUri: "https://get-service-ten.vercel.app/",
  })(req, res, next);
});

app.use(authProvider.interactionErrorHandler());

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
app.use(express.static(path.join(__dirname, "public/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/build", "index.html"));
});

export default app;
