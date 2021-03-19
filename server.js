const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");

const app = express();

app.use(cors());
app.use(express.json());

/* Log HTTP requests */
app.use(morgan("dev"));

module.exports = http.createServer(app);
