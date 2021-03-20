const server = require("./server");
const mongoose = require("mongoose");

const port = process.env.PORT || 5000;
const URL = "mongodb://localhost:27017/MercedesBenz";

// const socketIo = require("socket.io");
// const io = socketIo(server);

// //Whenever someone connects this gets executed
// io.on("connection", function (socket) {
//   console.log("A user connected");

//   //Whenever someone disconnects this piece of code executed
//   socket.on("disconnect", function () {
//     console.log("A user disconnected");
//   });
// });

server.listen(port, () => {
  console.log("Server online at http://localhost:5000");
  /* Connect to database */
  mongoose
    .connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((error) => {
      console.log(error);
    });
});
