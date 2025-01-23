const express = require("express");
const mongoose = require("mongoose");
const Router = require("./routes");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

/*mangoose local compass db*/
mongoose.connect('mongodb://localhost:27017/employees');

/*mangoose atlas db*/
//mongoose.connect('mongodb+srv://ajaychinmay0919:8hxFzZGsxzH4pTP9@cluster0.dlximhr.mongodb.net/employees?retryWrites=true&w=majority');


// ...
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

// ...
app.use(Router);

app.listen(1000, () => {
  console.log("Server is running at port 1000");
});
