const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const PORT = 3000
// manage express
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors : {
        origin : '*'
    },
    transports : ['polling', 'xhr-polling', 'jsonp-polling']
});

// manage nextjs
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
// Handle Next.js requests
nextApp.prepare().then(() => {
  app.all('*', (req, res) => {
    return handle(req, res);
  });
});

// manage socket
io.on("connection", (socket) => {
    console.log(io.sockets.sockets.keys())
    socket.emit("connection" , "connected to server")

    // room join
    socket.on("join" , room_id=>{
        socket.join(room_id)
        socket.emit("join" , "connected to room id " + room_id)
    })

    // data
    socket.on("data" , data => {
        const { room_id , message } = data
        io.to(room_id).emit("data" , {
            sender : socket.id,
            message
        })
    })
    
    socket.on("disconnect" , () => {
        console.log(socket.id + " disconnected")
        console.log(io.sockets.sockets.keys())
        socket.disconnect()
    })
})

server.listen(PORT , e=>{
    console.log(`server established at port number ${PORT}`)
})