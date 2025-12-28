import express from "express";
import { auth } from "@repo/auth";

const app = express();
app.use(express.json());

// BetterAuth built-in routes
app.use("/auth", auth.handler);

// Example protected route
app.get("/me", auth.middleware, (req, res) => {
  res.json(req.user);
});

app.listen(3001, () => {
  console.log("API running on :3001");
});
