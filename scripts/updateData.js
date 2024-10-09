const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const db = require("../db"); // Make sure the path is correct
const IpData = require("../models/item");

// Read and parse the JSON file
const jsonData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../telnet.json"), "utf8")
);

// Iterate through the parsed data and update the database
jsonData.forEach((deviceArray) => {
  deviceArray.forEach(async (device) => {
    const { VLAN, SERV_Port_NUM, ipaddress } = device;

    try {
      await IpData.findOneAndUpdate(
        { VLAN, ipaddress }, // Search criteria
        { SERV_Port_NUM }, // Fields to update
        { upsert: true, new: true }
      );
      console.log(`Updated/Inserted VLAN: ${VLAN}, IP: ${ipaddress}`);
    } catch (error) {
      console.error("Error updating/inserting data:", error);
    }
  });
});
