const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/vlan_tracking";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

db.on("error", (error) => {
  console.error("Mongoose connection error:", error);
});

db.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB");
});

module.exports = db;
