import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import { limiter } from "./middleware/ratelimit.js";

import { authRouter } from "./routes/auth.js";
import listingRouter from "./routes/listing.js";


import connectDB from "./db/connectDB.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT;

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));

app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    value: req.query,
    writable: true,
    configurable: true,
    enumerable: true,
  });
  next();
});

app.use(mongoSanitize());
app.use(xss());

app.use(limiter);

app.get("/", (req, res) => {
  res.json({ message: "server ate" });
});

app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter)


app.use((err, req, res, next) => {
  console.error("Global Error Caught:", err);
  
  res.status(500).json({ 
    message: err.message || "An unknown error occurred in the middleware." 
  });
});

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
