import { io } from "socket.io-client";

export default function Socket_Client(room_id){
    const hostname = location.host
    const socket = io(hostname)
    socket.on("connection",s=>{
        console.log(s)
        socket.emit("join" , room_id)
    })

    socket.isMe = function(data){
        return data.sender === socket.id
    }

    socket.sendMessage = function(message){
        const data = {
            room_id,
            message
        }
        socket.emit("data" , data)
    }

    socket.on("data" , data => {
        if(socket.isMe(data)) return
        socket?.onData(data.message)
    })

    socket.on("join" , data => {
        console.log(data)
    })
    
    window.sendMessage = socket.sendMessage
    return socket
}