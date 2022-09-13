const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");


// configure static files in public folder
app.use(express.static(path.join(__dirname,'public')));




// render the home page
app.get("/",(req,res)=>{
  res.sendFile(__dirname + "/index.html");
});

let clients = [];

// code for the socket connection goes here
io.on("connection",async(socket)=>{
  clients = [];

  // test if the user is connected to the network
  console.log(`${socket.handshake.auth.name} with Id=${socket.id} is connected to the Socket network!`);


  // when a new user is connected than send the list of connected users to him
  let sockets = await io.fetchSockets();

  for(let sock of sockets)
  {
    let userData = {
      name: sock.handshake.auth.name,
      id: sock.id,
    };

    if(sock.id !== socket.id){ // not the new User data
      clients.push(userData);
    }
  }

  let newUser = {
    name: socket.handshake.auth.name,
    id: socket.id,
  }

  io.to(socket.id).emit("all-users",clients);    // sending all users to new users

  // and also send the new user to all connected users except new User
  socket.broadcast.emit("new-user",newUser);


  // get the private message
  socket.on("private-message",(sender,reciever,message)=>{
    io.to(reciever).emit('private-message',sender,message);
  })

  // handle the disconnection of the socket
  socket.on('disconnect',()=>{
    console.log(`${socket.handshake.auth.name} with id=${socket.id} got disconnected!`);
    socket.broadcast.emit("user-disconnected",socket.id);
  })
});




// PORT
const PORT = 8080;

server.listen(PORT,()=>{
  console.log(`listening to the PORT ${PORT}`);
});
