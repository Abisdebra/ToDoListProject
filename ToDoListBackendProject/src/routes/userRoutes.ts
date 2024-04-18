import express, { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import { UserCredentialModel } from "../model/userCredModel";
import { createTaskModel } from "../model/taskModel";
import { UserCredential } from "../types/userCred";

export const userRouter: Router = express.Router();

userRouter.post("/register", async (request: Request, response: Response) => {
  let { username, email, password } = request.body;

  let existingUser = await UserCredentialModel.find({ email: email });

  if (existingUser.length === 0) {
    try {
      let salt = await bcrypt.genSalt(10);
      let hashedPassword = await bcrypt.hash(password, salt);

      await UserCredentialModel.create({
        username: username,
        email: email,
        password: hashedPassword,
      });

      let collectionName = `${username}-tasks`;
      let TaskModel = createTaskModel(collectionName);

      try {
        await TaskModel.createCollection().then((collection) => {
          response
            .status(200)
            .send(`Collection created: ${collection.collectionName}`);
        });
      } catch (error) {
        response.status(500).send("Error creating collection");
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    response.status(404).send("Error! email already exists");
  }
});

userRouter.post("/login", async (request: Request, response: Response) => {
  let { email, password } = request.body;

  try {
    let loginUser = await UserCredentialModel.find({ email: email });
    let hashedPassword = loginUser[0].password;

    bcrypt.compare(password, hashedPassword).then((result) => {
      if (result) {
        response.status(200).send("Signed in successfully");
      } else {
        response.status(400).send("Incorrect password or email");
      }
    });
  } catch (error) {
    console.error(error);
  }
});

userRouter.get(
  "/username/:email",
  async (request: Request, response: Response) => {
    let email = request.params["email"];

    try {
      let user: UserCredential[] = await UserCredentialModel.find({
        email: email,
      });
      let username = user[0].username;
      if (username) {
        response.status(200).send({ username: username });
      } else {
        response.status(400).send("Unable to retreive username");
      }
    } catch (error) {
      console.error(error);
    }
  }
);
