import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import { taskRouter } from "./routes/taskRoutes";
import { userRouter } from "./routes/userRoutes";

const app: Application = express();
const hostname: string = "127.0.0.1";
const port: number = 3000;

mongoose.connect("mongodb://localhost:27017/taskdb");

app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.get("/", (request: Request, response: Response) => {
  response
    .status(200)
    .send("This is the homepage of the to-do list backend project");
});

app.use("/tasks", taskRouter);
app.use("/user", userRouter);

app.listen(port, hostname, () => {
  console.log(`To Do List server is started at http://${hostname}:${port}`);
});
