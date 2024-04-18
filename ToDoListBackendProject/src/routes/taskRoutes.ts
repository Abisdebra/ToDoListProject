import express, { Router, Request, Response } from "express";
import { createTaskModel } from "../model/taskModel";
import { Task } from "../types/tasks";

export const taskRouter: Router = express.Router();

taskRouter.get(
  "/retrieve_tasks/:username",
  async (request: Request, response: Response) => {
    let username = request.params["username"];

    try {
      let TaskModel = createTaskModel(`${username}-tasks`);
      response.status(200).json(await TaskModel.find({}));
    } catch (error) {
      console.error(error);
    }
  }
);

taskRouter.post(
  "/retrieve_delete_task/:username",
  async (request: Request, response: Response) => {
    let username = request.params["username"];
    let task = request.body;

    try {
      let TaskModel = createTaskModel(`${username}-tasks`);
      response
        .status(200)
        .json(await TaskModel.findByIdAndDelete({ _id: task.id }));
    } catch (error) {
      console.error(error);
    }
  }
);

taskRouter.post(
  "/create_task/:username",
  async (request: Request, response: Response) => {
    let username = request.params["username"];

    try {
      let TaskModel = createTaskModel(`${username}-tasks`);
      await TaskModel.create({
        name: request.body.name,
        status: request.body.status,
        priority: request.body.priority,
      });
    } catch (error) {
      console.error(error);
    }

    response.status(200).send("Task has been successfully created!");
  }
);

taskRouter.delete(
  "/delete_task/:username",
  async (request: Request, response: Response) => {
    let username = request.params["username"];
    let deleted: Task = request.body;

    try {
      let TaskModel = createTaskModel(`${username}-tasks`);
      await TaskModel.deleteOne({ _id: deleted.id });
    } catch (error) {
      console.error(error);
    }

    response.status(200).send(`Task ${deleted} has been successfully deleted!`);
  }
);

taskRouter.put(
  "/update_task/:username",
  async (request: Request, response: Response) => {
    let username = request.params["username"];
    let updated: Task = request.body;

    try {
      let TaskModel = createTaskModel(`${username}-tasks`);
      await TaskModel.updateOne(
        { _id: updated.id },
        {
          name: updated.name,
          status: updated.status,
          priority: updated.priority,
        }
      );
    } catch (error) {
      console.error(error);
    }

    response
      .status(200)
      .send(`Task ${updated.id} has been successfully updated!`);
  }
);

taskRouter.put(
  "/complete_task/:username",
  async (request: Request, response: Response) => {
    let username = request.params["username"];
    let updated: Task = request.body;

    try {
      let TaskModel = createTaskModel(`${username}-tasks`);
      await TaskModel.updateOne(
        { _id: updated.id },
        { status: updated.status }
      );
    } catch (error) {
      console.error(error);
    }

    response
      .status(200)
      .send(`Task ${updated.id} has been successfully updated!`);
  }
);
