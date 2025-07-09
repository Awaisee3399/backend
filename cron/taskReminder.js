console.log("✅ Cron job file loaded successfully");
const cron = require("node-cron");

const Task = require("../models/Task");
const User = require("../models/User");
const { sendEmail } = require("../utils/mailer");
const dayjs = require("dayjs");

cron.schedule("0 * * * *", async () => {
    console.log("Running task reminder cron");

    const tomorrow = dayjs().add(1, "day").format("MM/DD/YYYY");

    const tasksDueSoon = await Task.find({
        dueDate: tomorrow,
        status: { $ne: "completed" },
    });

    for (let task of tasksDueSoon) {
        const user = await User.findOne();
        if (user) {
            await sendEmail(
                user.email,
                `Reminder: Task "${task.title}" is due soon`,
                `<p>This is a reminder that your task <strong>${task.title}</strong> is due on ${task.dueDate}.</p>`
            );
        }
    }
});