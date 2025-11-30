import mongoose from "mongoose";
import connect from "../lib/mongoose";
import User from "../models/User";
import Project from "../models/Project";
import Column from "../models/Column";
import Task from "../models/Task";

async function run(){
  await connect();
  await Promise.all([User.deleteMany(), Project.deleteMany(), Column.deleteMany(), Task.deleteMany()]);
  const users = await User.create([
    { name: "Alice", email: "alice@example.com" },
    { name: "Bob", email: "bob@example.com" },
    // ... up to 10
  ]);
  const project = await Project.create({ name: "Acme Launcher", description: "Main project", members: users.map(u=>u._id) });
  const columns = await Column.create([
    { projectId: project._id, title: "To Do", order: 0 },
    { projectId: project._id, title: "In Progress", order: 1 },
    { projectId: project._id, title: "Done", order: 2 },
  ]);
  await Task.create([
    { projectId: project._id, columnId: columns[0]._id, title: "Set up DB", description: "", order: 0 },
    { projectId: project._id, columnId: columns[1]._id, title: "Design Landing", description: "Create hero sections", order: 0 },
  ]);
  console.log("Seed complete");
  process.exit();
}

run().catch(err => { console.error(err); process.exit(1); });
