const mongoose = require("mongoose");

const ipDataSchema = new mongoose.Schema({
  VLAN: String,
  SERV_Port_NUM: String,
  ipaddress: String,
});

const IpData = mongoose.model("IpData", ipDataSchema, "ip_datas");

module.exports = IpData;
