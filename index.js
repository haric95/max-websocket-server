const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });

  socket.on("chat message", () => {
    // emit to all clients
    io.sockets.emit("hello", "ableton");
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("listening on *:3000");
});
