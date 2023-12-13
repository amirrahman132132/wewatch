const { Server } = require('socket.io')
const { createServer } = require("http")

// Create a Socket.IO server
const PORT = 3000
const HOST = "http://localhost"
const URL = `${HOST}:${PORT}`

const httpServer = new createServer()

const io = new Server(httpServer, {
    cors : {
        origin : '*'
    },
    transports : ['polling', 'xhr-polling', 'jsonp-polling']
});

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

httpServer.listen(PORT , e=>{
    console.log(`server established at ${URL}`)
})