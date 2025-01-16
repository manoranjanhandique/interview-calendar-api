require("./config/dbConnect");
const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
const candidatesRouter = require('./routes/candidatesRoutes');
const interviewerRoutes = require('./routes/interviewersRoutes');
// const groupRoute=require("./routes/groupRoute");
const errorHandler = require("./middlewares/errorHandler");
const express = require("express");
// const cors = require("cors");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Allow only this origin
//     methods: ["GET", "POST", "PUT", "PATCH","DELETE"], // Allow these methods
//     credentials: true,
//   })
// );

app.use("/api", candidatesRouter);
app.use("/api", interviewerRoutes);

app.use(errorHandler);
module.exports = app;
