import { useEffect, useRef, useState } from "react"
import signal_system_client from "../../../scripts/signal_system/signal_system_client"
import { Section } from "../corepagedesign/CorePageComponents"
import Image from "next/image"
import Head from "next/head"
import Link from "next/link"

export default function ChatBody({ messages, onSend }) {
    const [msg, setmsg] = useState("")
    const [msgs, setmsgs] = useState([])
    const [room, setroom] = useState("123")
    const [loading, setloading] = useState(false)
    const [typing, settyping] = useState(false)

    const signal_ref = useRef(null)
    const scrollEl = useRef(null)

    function debounce(fn, delay) {
        let timerId
        return function (...args) {
            clearTimeout(timerId)
            timerId = setTimeout(() => {
                fn.apply(this, args)
            }, delay)
        }
    }

    function handleSubmit(e) {
        e.preventDefault()
        onSend?.(msg)
        setmsg("")

        sentAudioRef.current.volume = 0.3
        sentAudioRef.current.play()

        const signal = signal_ref.current
        signal.send({
            type: "message",
            data: msg
        })
    }

    // room change manage
    const debouncedInput = debounce(async function (val) {
        setloading(true)
        await signal_ref.current.setChannel(val)
        setloading(false)
    }, 1000)

    useEffect(() => {
        setmsgs([])
        debouncedInput(room)
    }, [room])

    // signal setup
    useEffect(() => {
        const signal = signal_system_client({
            baseurl: location.href + "api/signaling",
            channel: "123"
        })
        signal_ref.current = signal
        window.signal = signal

        signal.on.data.bind((res) => {
            if (res.type !== "message") return
            setmsgs((v) => [...v, res])
        }, false)

        signal.startPoll()
    }, [])

    // scroll bottom
    useEffect(() => {
        let el = scrollEl.current,
            sp = el.scrollTop + el.offsetHeight,
            sh = el.scrollHeight,
            diff = sh - sp
        console.log(diff)
        if (diff <= 100) {
            scrollEl.current.scroll(0, 9999999999)
        }
    }, [msgs])

    // typing signal
    const lastTyping = useRef(false)
    const debouncedTypingSignalFunction = debounce(async ()=>{
        settyping(false)
    },1000 * 60 * 5)

    useEffect(() => {
        signal_ref.current.on.data.bind((v) => {
            if (v.type !== "typing") return
            if (v.info.sender === signal_ref.current.id) return
            settyping(v.data)
            debouncedTypingSignalFunction()
        }, false)
    }, [])

    useEffect(() => {
        let istyping = msg.length > 0
        if (lastTyping.current !== istyping) {
            signal_ref.current.send({
                type: "typing",
                data: istyping
            })
            lastTyping.current = istyping
        }
    }, [msg])

    // playing sound
    const messageAudioRef = useRef()
    const typingAudioRef = useRef()
    const sentAudioRef = useRef()
    
    useEffect(()=>{
        signal_ref.current.on.data.bind(v=>{
            if(!v.info.initial_load && !v.info.is_me && v.type === 'message'){
                messageAudioRef.current.time = 0
                messageAudioRef.current.play()
            }
        },false)
    },[])

    useEffect(()=>{
        if(typing){
            typingAudioRef.current.time = 0
            typingAudioRef.current.volume = 0.2
            typingAudioRef.current.loop = true
            typingAudioRef.current.play()
        }
        else {
            typingAudioRef.current.pause()
        }
    },[typing])



    // styles
    const myChatStyles = {
        background: "#d8caff"
    }

    const otherChatStyles = {
        // border : '1px solid #d8caff'
    }

    return (
        <Section>
            <Head>
                {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" /> */}
            </Head>
            <audio ref={messageAudioRef} src={`/chat_system/message.mp3`}></audio>
            <audio ref={typingAudioRef} loop={true} src={`/chat_system/typing.mp3`}></audio>
            <audio ref={sentAudioRef} loop={false} src={`/chat_system/sent.mp3`}></audio>
            <div className="chatBody flex flex-col gap-5 max-w-[550px] w-full mx-auto m-5" style={{ opacity: loading ? "0.5" : "1" }}>
                {loading ? <div className="text-gray-600 bg-yellow-300 p-3">loading...</div> : ""}
                <div className="roomid flex bg-white">
                    <div className="text bg-gray-200 p-3 text-gray-500">room</div>
                    <input className="w-full p-3" placeholder="type your message here." type="text" onInput={(e) => setroom(e.target.value)} value={room} />
                </div>
                <form onSubmit={handleSubmit}>
                    <div ref={scrollEl} className="messages h-[350px] bg-white p-4 rounded-sm w-full overflow-y-auto relative">
                        <div className="scrollWrapper transition">
                            {msgs.map((each, i) => {
                                const is_me = each.info.sender === signal_ref.current.id
                                return (
                                    <div key={i} style={is_me ? myChatStyles : otherChatStyles} className="each scaleInAnimate flex gap-3 rounded-sm border-b p-2 px-3 text-xs">
                                        <div className="info text-gray-500 w-16">
                                            {is_me ? "Me" : "Others"}
                                            {/* {each.info.sender} */}
                                        </div>
                                        <div className="text">{each.data}</div> 
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div
                        className="typing p-2 px-3 text-xs bg-white"
                        style={{
                            height: typing ? "40px" : "0px",
                            transition: "0.2s all",
                            overflow: "hidden",
                            ...(typing ? {} : { padding: 0 })
                        }}
                    >
                        <div className="wrapper flex gap-2 items-center text-gray-600">
                            <Image className="" width={40} height={40} src={'/chat_system/tenor.gif'} alt={''} />
                            <div className="text">someone is typing</div>
                        </div>
                    </div>
                    <input className="border-t w-full p-3" placeholder="type your message here." type="text" onInput={(e) => setmsg(e.target.value)} value={msg} />
                </form>
            </div>
        </Section>
    )
}
