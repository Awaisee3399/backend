const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get("/tasks", protect, getTasks);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task (supports file upload)
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, todo, in-progress, done, completed]
 *               category:
 *                 type: string
 *                 enum: [high, medium, low]
 *               dueDate:
 *                 type: string
 *                 format: date
 *               comments:
 *                 type: string
 *                 description: JSON stringified array of comments
 *                 example: '[{"text": "My comment"}]'
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Task created
 */
router.post("/tasks", protect, upload.single("file"), createTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated
 */
// router.put("/tasks/:id", protect, updateTask);
router.put("/tasks/:id", protect, upload.single("file"), updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted
 */
router.delete("/tasks/:id", protect, deleteTask);

module.exports = router;
