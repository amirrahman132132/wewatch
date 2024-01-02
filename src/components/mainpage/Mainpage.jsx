"use client"

import { useEffect, useRef, useState } from "react"
import signal_system_client from "../../../scripts/signal_system/signal_system_client"
import { copytoclipboard } from "../../../scripts/common"
import { Button, Input, Section } from "../corepagedesign/CorePageComponents"
import VideoPlayer from "../videoplayer/VideoPlayer"

export default function Mainpage(props) {
    const { room_id } = props

    const inputEl = useRef()
    const [roomLink, setroomLink] = useState("")
    const [videoLink, setvideoLink] = useState("http://index1.circleftp.net/FILE/Hindi%20Movies/2023/Yaariyan%202%20%282023%29%201080p%20HQ%20S-Print%20Hindi%20x264/Yaariyan%202%20%282023%29%201080p%20HQ%20S-Print%20Hindi%20x264.mkv")
    const videoEl = useRef()
    const videoIEL = useRef()

    // socket handling
    const socket = useRef()
    useEffect(() => {
        setroomLink(location.href)
    }, [])
    // networking
    const signal = signal_system_client({
        baseurl : `${location.href.split('/room')[0]}/api/signaling`,
        channel : room_id
    })

    window.signal = signal

    signal.on.data.bind(res=>{
        console.log(res)
        if(res.info.sender === signal.id) return
        playerInfo.current.changedByUser = false
        const delay = (Date.now() - res.time + playerInfo.current.playedAfter) / 1000
        playPause(res.currentTime + (res.play ? delay : 0), res.play)
    },false)

    signal.startPoll()

    function handleFileSelect(e) {
        const file = e.target.files[0]
        if (file) {
            videoEl.current.src = URL.createObjectURL(file)
        }
    }

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
                    <VideoPlayer reff={videoEl} videoLink={videoLink} />
                </Section>
                <Section>
                    <div className="selectFile">
                        <input onChange={handleFileSelect} type="file" />
                    </div>
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
