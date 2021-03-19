const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.json");

const Admin = require("../models/admin");
const Room = require("../models/room");

module.exports = (admin) => async (request, response, next) => {
  let token;
  if (
    //Check if bearer token exists
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer ")
  ) {
    //Get bearer token
    token = request.headers.authorization.split("Bearer ")[1];
  } else {
    //console.error("No token found");
    return response.status(403).json({ error: "Unauthoraized" });
  }

  let auth_token;

  jwt.verify(token, JWT_SECRET, (error, decodedToken) => {
    auth_token = decodedToken;
  });

  //If token is not succesfully decoded
  if (!auth_token) return response.status(403).json({ error: "Unauthoraized" });

  let user;
  let room;

  try {
    //If user is an administrator
    if (auth_token.user.username) {
      //Check if user exists
      user = await Admin.findOne({
        username: auth_token.user.username,
      }).select(["-password"]);

      request.user = user;
    } else {
      room = await Room.findOne({ roomId: auth_token.room.roomId });

      request.room = room;
    }
  } catch (error) {
    return response.status(500).json({ error });
  }

  //If user doesnt exist send error response
  if (!user) return response.status(403).json({ error: "Unauthoraized" });

  //If using as admin authorization middleware. check if user is admin
  if (admin === "admin") {
    if (!user) {
      return response.status(403).json({ error: "Unauthoraized" });
    }
  }

  return next();
};