export interface Task {
  id: number;
  name: string;
  status: "Created" | "Ongoing" | "Completed";
  priority: string;
}
