import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  status: { type: String },
  priority: { type: String },
});

export const createTaskModel = (collectionName?: string) => {
  return mongoose.model("tasks", TaskSchema, collectionName);
};
