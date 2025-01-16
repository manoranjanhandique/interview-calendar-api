const connectDB = require("./src/config/dbConnect");
const { handleErrors }=require("./src/middlewares/globalErrorHandler")
const app = require("./src/app");
const PORT = process.env.PORT || 8000;
const http = require('http');
const server = http.createServer(app);


handleErrors(server);
connectDB()
  .then(() => {
    console.log(`Database Connection Established...`);
    app.listen(PORT, (err) => {
      if (err) console.log(`Server Error : ${err}`);

      console.log(`Server listening on port : ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
