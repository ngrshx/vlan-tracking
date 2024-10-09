const express = require("express");
const { connectToServer } = require("./telnet-client"); // Import the function
const app = express();
const PORT = 3000;
const path = require("path");
const fs = require("fs");
// Import the connection code
require("./db"); // Ensure the connection file is loaded
const IpData = require("./models/item");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.post("/add", async (req, res) => {
  const apiKey = req.body.api_key;
  if (apiKey) {
    try {
      const vlanInfo = await connectToServer(apiKey); // Get the VLAN info from the telnet-client
      if (vlanInfo) {
        // Save the VLAN info to MongoDB
        for (const vlan of vlanInfo) {
          const newEntry = {
            VLAN: vlan.VLAN,
            SERV_Port_NUM: vlan.SERV_Port_NUM,
            ipaddress: vlan.ipaddress, // This will be the IP address entered in the input
          };
          const ipData = new IpData(newEntry);
          await ipData.save(); // Save the entry to the MongoDB collection
        }
      }
      res.redirect("/vlan-base");
    } catch (error) {
      res.status(500).send("Error connecting to server: " + error.message);
    }
  } else {
    res.status(400).send("API key is required");
  }
});

app.get("/vlan-base", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/base.html"));
});
app.get("/api/vlans", async (req, res) => {
  try {
    const data = await IpData.find(); // Fetch all entries from the ip_datas collection
    res.json(data); // Send the data as JSON
  } catch (error) {
    res.status(500).send("Error fetching data: " + error.message);
  }
});
app.get("/delete/:id", (req, res) => {
  let arr = [];
  fs.readFile("telnet.json", (err, data) => {
    arr = JSON.parse(data.toString());
    if (req.params.id < arr.length) {
      arr.splice(req.params.id, 1);
      console.log(arr);
      fs.writeFile("telnet.json", JSON.stringify(arr, null, 2), (err) => {
        if (err) {
          console.error("Error writing to file:", err);
        } else {
          res.redirect("/vlan-base");
        }
      });
    } else {
      res.send("NOT FOUND");
    }
  });
});

app.get("/api/vlans", (req, res) => {
  fs.readFile("telnet.json", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.listen(PORT, () => {
  console.log("Server is connected");
});
