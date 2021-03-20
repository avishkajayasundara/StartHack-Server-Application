const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const auth = require("./middleware/auth");

const {
  admin_create,
  admin_login,
  room_create,
  room_login,
} = require("./controllers/users");

const { uploadSong } = require("./controllers/songs");

const app = express();

app.use(cors());
app.use(express.json());

/* Log HTTP requests */
app.use(morgan("dev"));

app.post("/admin-create", admin_create);
app.post("/admin-login", admin_login);

app.post("/room-create", auth("admin"), room_create);
app.post("/room-login", room_login);

app.post("/add-song", auth("admin"), uploadSong);

module.exports = http.createServer(app);
