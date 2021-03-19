const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.json");

const Admin = require("../models/admin");

exports.admin_create = async (request, response) => {
  try {
    const username = "admin";
    let password = "password";

    const user = await Admin.findOne({ username: username });

    if (user)
      return response
        .status(400)
        .json({ error: { username: "User already exists" } });

    //Hash password
    password = await bcrypt.hash(password, 6);

    const admin = {
      username,
      password,
    };

    const created_admin = await Admin.create(admin);

    return response.status(201).json({ created_admin });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error });
  }
};

/* USER LOGIN */
exports.admin_login = async (request, response) => {
  const { username, password } = request.body;
  let errors = {};
  try {
    if (!username || username.trim() === "")
      errors.username = "Email must not be empty";
    if (!password || password === "")
      errors.password = "Password must not be empty";

    //If there are any errors return response JSON with errors
    if (Object.keys(errors).length > 0)
      return response.status(400).json({ error: errors });

    const user = await Admin.findOne({ username: username });

    if (!user)
      return response
        .status(404)
        .json({ error: { username: "User not found" } });

    //Check password
    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      errors.password = "Password is incorrect";
      return response.status(400).json({ error: errors });
    }

    //Generate JWT
    let token = jwt.sign({ username }, JWT_SECRET, { expiresIn: 2 * 60 * 60 });

    return response.json({ token });
  } catch (error) {
    //console.log(error);
    return response.status(500).json({ error });
  }
};
