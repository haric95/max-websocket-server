const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "http://localhost:3001" } });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    if (socket.handshake.query.clientType === "max") {
      console.log("a user disconnected");
    }
  });

  socket.on("chat message", (key) => {
    // emit to all clients
    console.log(`emitting chat message to ${key}`);
    io.to(key).emit("hello", "ableton");
  });

  // Max client joining room.
  if (
    socket.handshake.query.clientType === "max" &&
    socket.handshake.query.connectionKey
  ) {
    console.log(`max client joining ${socket.handshake.query.connectionKey}`);
    socket.join(socket.handshake.query.connectionKey);
    // Browser client joining room.
  } else if (
    socket.handshake.query.clientType === "browser" &&
    socket.handshake.query.connectionKey
  ) {
    if (io.sockets.adapter.rooms.has(socket.handshake.query.connectionKey)) {
      console.log(
        `browser client joining ${socket.handshake.query.connectionKey}`
      );
      console.log("the room exists!");
      socket.join(socket.handshake.query.connectionKey);
    } else {
      console.log("here");
      socket.join(socket.handshake.query.connectionKey);
      console.log("creating temp room");
      io.to(socket.handshake.query.connectionKey).emit(
        "browser message",
        "that room key doesn't look right"
      );
      socket.disconnect();
      console.log(io.sockets.adapter.rooms);
    }
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
