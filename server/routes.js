const express = require("express");
const userModel = require("./model/users");
const recordModel = require("./model/records");
const app = express();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/*register and login api start*/
app.post("/register", async (request, response) => {
  const { username, email, password } = request.body;

  try {
    // Check if the username already exists
    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      return response.status(400).json({ error: "Username already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new userModel({ username, email, password: hashedPassword });

    // Save the new user to the database
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ username: user.username }, "your_secret_key", { expiresIn: "1h" });

    // Send the token and user information in the response
    response.status(201).json({ token, user: { username: user.username } });
  } catch (error) {
    console.error("Error during user registration:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// Login API
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user with the provided username
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate and send a JWT token
    const token = jwt.sign({ username: user.username }, "your_secret_key", { expiresIn: "1h" });
    res.json({ token, userid: user._id, username: user.username });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
/*register and login api end*/

/*users api start*/
//featch all the users
app.get("/users", async (request, response) => {
  console.log("api called succesfully");
  const users = await userModel.find({});

  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

//new user add
app.post("/users", async (request, response) => {
  console.log("api called succesfully");
  const user = new userModel(request.body);
  try {
    await user.save();
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});
/*users api end*/

/*records api start*/
//Fetch all records
app.get("/records", async (request, response) => {
  console.log("api called succesfully");
  const records = await recordModel.find({});

  try {
    response.send(records);
  } catch (error) {
    response.status(500).send(error);
  }
});

// Fetch records for a specific user
app.get("/recordsbyuserid/:id", async (req, res) => {
  console.log("api called succesfully");
    const records = await recordModel.find({ userid: req.params.id });
    
    try {
      res.send(records);
    } catch (error) {
      res.status(500).send(error);
    }
});

//Add new record
app.post("/records", async (request, response) => {
  console.log("api called succesfully");
  const record = new recordModel(request.body);
  try {
    await record.save();
    response.send(record);
  } catch (error) {
    response.status(500).send(error);
  }
});

// Fetch record details for a specific recordid
app.get("/records/:id", async (request, response) => {
  const recordid = request.params.id;
  console.log("Single record display API called successfully");

  try {
    // Use findById to fetch a record by ID
    const record = await recordModel.findById(recordid);
    if (!record) {
      // If no record is found, send a 404 response
      return response.status(404).send("Record not found");
    }
    
    response.send(record);
  } catch (error) {
    response.status(500).send(error.message);
  }
});

// This section will help you update a single record by id
app.put("/records/:id", async (request, response) => {
  const reocrdid = request.params.id;
  const updatedData = request.body; // Assuming you send the updated data in the request body

  console.log("API called successfully for update");

  try {
    // Use findByIdAndUpdate to update a record by ID
    const updatedRecord = await recordModel.findByIdAndUpdate(
      reocrdid,
      updatedData,
      { new: true } // Return the updated record
    );

    if (!updatedRecord) {
      // If no record is found, send a 404 response
      return response.status(404).send("Record not found");
    }

    response.send(updatedRecord);
  } catch (error) {
    console.error("Error:", error);

    // Send a more detailed error message in the response
    response.status(500).send(`Error updating record: ${error.message}`);
  }
});

// This section will help you delete a single record by id
app.delete("/records/:id", async (request, response) => {
  const recordId = request.params.id;

  console.log("API called successfully for delete", recordId);

  try {
    // Use findByIdAndDelete to delete a record by ID
    const deletedRecord = await recordModel.findByIdAndDelete(recordId);

    if (!deletedRecord) {
      // If no record is found, send a 404 response
      return response.status(404).send("Record not found");
    }

    response.send(deletedRecord);
  } catch (error) {
    console.error("Error:", error);

    // Send a more detailed error message in the response
    response.status(500).send(`Error deleting record: ${error.message}`);
  }
});

 /*records api start*/
  
module.exports = app;