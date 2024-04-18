import mongoose from "mongoose";

const UserCredentialSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const UserCredentialModel = mongoose.model(
  "userCredentials",
  UserCredentialSchema
);
