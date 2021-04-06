const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

app.set("view engine", "ejs");
app.use(express.static("public"));

//redirect to specific room on entry
app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

//enter room specified by ID in URL
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

//connect to WebRTC room on URL join
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.emit("user-connected", userId);
  });
});

server.listen(3000);
