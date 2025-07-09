// const express = require('express');
// const { signup, signin } = require('../controllers/authController');
// const router = express.Router();

// router.post('/signup', signup);
// router.post('/signin', signin);

// module.exports = router;
const express = require("express");
const { signup, signin } = require("../controllers/authController");
const router = express.Router();

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: User signup
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */
router.post("/signup", signup);

/**
 * @swagger
 * /api/signin:
 *   post:
 *     summary: User signin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed in successfully
 */
router.post("/signin", signin);

module.exports = router;
