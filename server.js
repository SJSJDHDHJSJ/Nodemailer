const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
app.use(express.json());
app.use('/users', require('./Routes/userRoute'));

mongoose.connect(process.env.CONNECTION)
.then(() => console.log("Connected to DB"))
.catch((error) => console.error("Error connecting to DB: ", error));



app.listen(3300, () => {
  console.log("Server is running on port 3300");
});

