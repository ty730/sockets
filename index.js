"use strict";

const express = require("express");
const socketIO = require("socket.io");

const PORT = process.env.PORT || 3000;
const INDEX = "/public/index.html";

const server = express()
  .use(express.static("public"))
  .listen(PORT, () => console.log(`Listensing on ${PORT}`));

const io = socketIO(server);

const lobbies = [];

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("get-lobbies", () => {
    console.log("current lobbies are:" + lobbies);
    socket.emit("give-lobbies", lobbies);
  });

  socket.on("new-game", lname => {
    let lobby = {"lname": lname, "src":[], "players":[]};
    lobbies.push(lobby);
    console.log("emit new-lobby: " + lobby);
    socket.emit("new-lobby", lobby);
  });

  socket.on("join-game", lname => {
    let index = -1;
    for (let i = 0; i < lobbies.length; i++) {
      console.log(i + ": " + lobbies[i].lname);
      if (lname == lobbies[i].lname) {
        console.log("found name!");
        index = i;
      }
    }
    if (index == -1) {
      console.log("no game of name: " + lname);
      socket.emit("joined-game", null);
    } else {
      //let lobby = {"lname": lname, "src": [], "players": []};
      //lobbies.push(lobby);
      lobbies[index].players.push("player1");
      console.log("joined game: " + lname);
      socket.broadcast.emit("joined-game", lobbies[index]);
    }
  });
});

setInterval(() => io.emit("time", new Date().toTimeString()), 1000);