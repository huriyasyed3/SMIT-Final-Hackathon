const Task = require('../models/taskModel');

// Create Task
const createTask = async (req, res) => {
  const { title, description, assignedTo } = req.body;
  const task = await Task.create({ title, description, assignedTo });
  res.status(201).json(task);
};

// Get All Tasks
const getTasks = async (req, res) => {
  const tasks = await Task.find().populate('assignedTo', 'username');
  res.json(tasks);
};

// Update Task
const updateTask = async (req, res) => {
  const { status } = req.body;
  const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(task);
};

// Delete Task
const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task removed' });
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
