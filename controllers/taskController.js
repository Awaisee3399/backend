const mongoose = require("mongoose");
const Task = require("../models/Task");
const { sendEmail } = require("../utils/mailer");
const User = require("../models/User");
const dayjs = require("dayjs");

exports.getTasks = async (req, res) => {
  const { page = 1, limit = 100, dueDate, search } = req.query;

  try {
    let filter = {};
    if (search) {
      filter.$text = { $search: search };
    }
    if (dueDate) {
      filter.dueDate = dueDate;
    }

    const skip = (page - 1) * limit;
    const total = await Task.countDocuments(filter);

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      total,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, category, dueDate } = req.body;

    let parsedComments = [];
    if (req.body.comments) {
      try {
        parsedComments = JSON.parse(req.body.comments);
      } catch (err) {
        return res.status(400).json({ message: "Invalid comments format" });
      }
    }

    if (!title || !description || !status || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let color;
    if (category.toLowerCase() === "high") color = "red";
    else if (category.toLowerCase() === "medium") color = "green";
    else if (category.toLowerCase() === "low") color = "yellow";
    else return res.status(400).json({ message: "Invalid category value" });

    let fileData = null;
    if (req.file) {
      fileData = {
        originalName: req.file.originalname,
        fileName: req.file.filename,
        size: req.file.size,
        path: req.file.path.replace(/\\/g, "/"),
        mimeType: req.file.mimetype,
      };
    }

    const task = new Task({
      title,
      description,
      status,
      category,
      color,
      dueDate: dayjs(dueDate).format("MM/DD/YYYY"),
      comments: parsedComments,
      file: fileData,
    });

    await task.save();


    if (status.toLowerCase() === "completed") {
      const user = await User.findOne();
      if (user) {
        await sendEmail(
          "awaismalik5877@gmail.com",
          `Task Created as Completed: ${task.title}`,
          `<p>The task <strong>${task.title}</strong> has been created with status <strong>completed</strong>.</p>`
        );
      }
    }

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error("Error in createTask:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, status, category, dueDate } = req.body;

    let parsedComments = [];
    if (req.body.comments) {
      try {
        parsedComments = JSON.parse(req.body.comments);
      } catch (err) {
        return res.status(400).json({ message: "Invalid comments format" });
      }
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid Task ID" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const previousStatus = task.status;

    // Update fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (category) {
      task.category = category;
      task.color =
        category === "high" ? "red" : category === "medium" ? "green" : "yellow";
    }
    if (dueDate) task.dueDate = dayjs(dueDate).format("MM/DD/YYYY");
    if (parsedComments.length) task.comments = parsedComments;
    if (req.file) {
      task.file = {
        originalName: req.file.originalname,
        fileName: req.file.filename,
        size: req.file.size,
        mimeType: req.file.mimetype,
        path: req.file.path.replace(/\\/g, "/"),
      };
    }

    await task.save();

    // ✅ Notify on any status change
    if (status && previousStatus !== status) {
      const user = await User.findOne();
      if (user) {
        await sendEmail(
          "awaismalik5877@gmail.com",
          `Task Status Changed: ${task.title}`,
          `<p>The task <strong>${task.title}</strong> status changed from <strong>${previousStatus}</strong> to <strong>${status}</strong>.</p>`
        );
      }
    }

    res.status(200).json({ message: "Task updated", task });
  } catch (error) {
    console.error("Error in updateTask:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
