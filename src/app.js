require("./config/dbConnect");
const bodyParser = require("body-parser");
const candidatesRouter = require('./routes/candidatesRoutes');
const interviewerRoutes = require('./routes/interviewersRoutes');
const errorHandler = require("./middlewares/errorHandler");
const express = require("express");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api", candidatesRouter);
app.use("/api", interviewerRoutes);

app.use(errorHandler);
module.exports = app;
