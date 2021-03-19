const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");

const { admin_create, admin_login } = require("./controllers/users");

const app = express();

app.use(cors());
app.use(express.json());

/* Log HTTP requests */
app.use(morgan("dev"));

app.post("/admin-create", admin_create);
app.post("/admin-login", admin_login);

module.exports = http.createServer(app);
