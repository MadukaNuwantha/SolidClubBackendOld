const express = require("express");

const authRouter = require("./routes/auth");

const cronRouter = require("./routes/cron");
const settingsRouter = require("./routes/settings");
const customersRouter = require("./routes/customers");
const techniciansRouter = require("./routes/technicians");
const authV2Router = require("./routes/authV2");
const miscellaneousRouter = require("./routes/miscellaneous");
const jobsRouter = require("./routes/jobs");
const notificationsRouter = require("./routes/notifications");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        return res.status(200).json({});
    }
    next();
});

app.use("/auth", authRouter);
app.use("/settings", settingsRouter);
app.use("/cron", cronRouter);
app.use("/customers", customersRouter);
app.use("/technicians", techniciansRouter);
app.use("/auth-v2", authV2Router);
app.use("/miscellaneous", miscellaneousRouter);
app.use("/jobs", jobsRouter);
app.use("/notifications", notificationsRouter);

module.exports = app;