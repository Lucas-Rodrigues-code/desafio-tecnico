import express from "express";
import cors from "cors";
import authRoute from "./routers/auth-route.js";
import connectDatabase from "./database/index.js";

const app = express();

const port = 4000;

connectDatabase();
app.use(cors());
app.use(express.json());
app.use("/auth", authRoute);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port} 🚀`);
});
