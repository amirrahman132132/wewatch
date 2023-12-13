import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"
import Title from "../../dom/Title"

export default function SocketClient() {
    const [messageToSend, setmessageToSend] = useState("something")
    const [receivedMessages, setreceivedMessages] = useState([])

    const _socket = useRef(false)

    function handleSend() {
        if (_socket.current) {
            _socket.current.emit("message" ,messageToSend)
        }
    }

    useEffect(() => {
        try {
            const socket = io("http://localhost:1000")
            socket.on("connection" , data=>{
                console.log(data)
            })
    
            socket.on("connect_error" , event => {
                console.log("connection failed")
            })
    
            socket.on("message" , data => {
                setreceivedMessages(v=>[...v , data])
            })
    
            _socket.current = socket
        } catch (error) {
            console.log("failed connection")   
        }

    }, [])

    return (
        <>
            <Title value={"Socket.io-client"} />
            <div className="texting flex flex-col gap-y-4 w-80 m-5">
                <div className="row">
                    <textarea className="border p-1 bg-transparent w-full h-full outline-none" value={messageToSend} onInput={(e) => setmessageToSend(e.target.value)}></textarea>
                </div>
                <div className="row">
                    <button className="p-2 px-4 w-full hover:bg-blue-600 bg-blue-400 text-white rounded-md" onClick={handleSend}>
                        Send
                    </button>
                </div>
                {receivedMessages.length > 0 ? (
                <div className="row flex flex-col gap-y-1 border p-1">
                    {receivedMessages.map((message, i) => {
                        return (
                            <div key={i} className="">
                                {message}
                            </div>
                        )
                    })}
                </div>
                ) : (
                    ""
                )}
            </div>
        </>
    )
}
