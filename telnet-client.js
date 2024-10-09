const telnet = require("telnet-client");
const fs = require("fs");
const server = new telnet();

async function connectToServer(host) {
  const params = {
    host: host,
    port: 23,
    shellPrompt: ">",
    timeout: 1500,
    loginPrompt: "login: ",
    passwordPrompt: "Password: ",
    username: "root",
    password: "Aztelekom@123",
  };

  try {
    await server.connect(params);
    console.log("Connected to the server");

    await server.send(params.username, { timeout: 1500, execTimeout: 5000 });
    await server.send(params.password, { timeout: 1500, execTimeout: 5000 });

    let res = await server.send("enable\r\ndisplay vlan all\r\n", {
      shellPrompt: ">",
    });
    console.log("Response:", res);

    const vlanLines = res.match(/^\s*\d+\s+\w+\s+\w+\s+\d+\s+\d+\s+-$/gm);
    if (vlanLines) {
      const vlanInfo = vlanLines.map((line) => {
        const parts = line.trim().split(/\s+/);
        return { VLAN: parts[0], SERV_Port_NUM: parts[4], ipaddress: host }; // Include the IP address
      });
      console.log(vlanInfo);

      // Save to telnet.json
      let arr = [];
      fs.readFile("telnet.json", (err, data) => {
        if (!err && data.length > 0) {
          arr = JSON.parse(data.toString());
        }
        arr.push(...vlanInfo); // Use spread to push array
        fs.writeFile("telnet.json", JSON.stringify(arr, null, 2), (err) => {
          if (err) {
            console.error("Error writing to file:", err);
          } else {
            console.log("Output saved to telnet.json");
          }
        });
      });

      return vlanInfo; // Return the VLAN info
    } else {
      console.error("No VLAN information found in the response");
      return []; // Return empty array if no VLAN info found
    }
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
}

module.exports = { connectToServer };
