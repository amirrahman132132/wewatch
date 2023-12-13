import { useEffect, useRef, useState } from "react"
import { Button, Input, Section } from "../corepagedesign/CorePageComponents"
import { copytoclipboard } from "../../common"
import Socket_Client from "./socket_client"

export default function Mainpage(props) {
    const { room_id } = props

    const inputEl = useRef()
    const [roomLink, setroomLink] = useState("")
    const [videoLink, setvideoLink] = useState("")
    const videoEl = useRef()
    const videoIEL = useRef()

    // socket handling
    const socket = useRef()
    useEffect(() => {
        setroomLink(location.href)
        socket.current = Socket_Client(room_id)
    }, [])

    // video player events
    const playerInfo = useRef({
        playing: false,
        playedByUser: false,
        timeNow: Date.now(),
        playedAfter: 0
    })

    function playPause(time, play) {
        const vEl = videoEl.current
        vEl.currentTime = time
        play ? vEl.play() : vEl.pause()
    }

    function playerData() {
        const vEl = videoEl.current
        return {
            currentTime: vEl.currentTime,
            play: playerInfo.current.playing,
            time: playerInfo.current.timeNow
        }
    }

    function emitPlayerData() {

    }

    useEffect(() => {
        const ws = socket.current
        const vEl = videoEl.current

        vEl.addEventListener(
            "click",
            (e) => {
                playerInfo.current.changedByUser = true
            },
            true
        )

        // recieving data
        ws.onData = function (data) {
            const delay = (Date.now() - data.time + playerInfo.current.playedAfter) / 1000
            console.log(delay)
            playerInfo.current.changedByUser = false
            playPause(data.currentTime + (data.play ? delay : 0), data.play)
        }

        // sending data
        vEl.addEventListener("playing", (e) => {
            playerInfo.current.timeNow = Date.now()
            playerInfo.current.playing = true
            if (playerInfo.current.changedByUser === false) return
            ws.sendMessage(playerData())
        })

        // vEl.addEventListener("playing", (e) => {
        //     playerInfo.current.playedAfter = Date.now() - playerInfo.current.timeNow
        // })

        vEl.addEventListener("pause", (e) => {
            playerInfo.current.timeNow = Date.now()
            playerInfo.current.playing = false
            if (playerInfo.current.changedByUser === false) return
            ws.sendMessage(playerData())
        })
    }, [])

    return (
        <>
            <div className="root flex flex-col gap-y-[20px] py-[20px] mx-4">
                <Section>
                    <div className="flex shadow pl-1 h-[40px] w-full" element_name="link">
                        <div className="h-full flex-auto flex items-center">
                            <Input reff={inputEl} defaultValue={roomLink} readOnly />
                        </div>
                        <div className="w-[50px] h-full flex justify-center items-center" element_name="buttons">
                            <button onClick={() => copytoclipboard(inputEl.current)} className="flex justify-center items-center flex-auto h-full hover:bg-blue-600 hover:text-white text-gray-600" title="copy link" value="http://localhost:81/">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </Section>

                <Section>
                    <video ref={videoEl} src={videoLink} className="w-full" controls autoPlay={false}></video>
                </Section>

                <Section>
                    <div className="addvideo flex">
                        <div className="input flex-auto shadow">
                            <Input reff={videoIEL} placeholder="www.example.mp4" defaultValue={videoLink} />
                        </div>
                        <div element_name="buttons" className="my-auto">
                            <Button onClick={() => setvideoLink(videoIEL.current.value)}>ADD VIDEO</Button>
                        </div>
                    </div>
                </Section>
            </div>
        </>
    )
}
