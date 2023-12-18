import Head from "next/head"
import Image from "next/image"

import { Button } from "../components/corepagedesign/CorePageComponents"
import { generateRandomString } from "../scripts/common"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import signal_system_client from "../scripts/signal_system/signal_system_client"

export default function Home() {
    const [messages, setmessages] = useState([])

    useEffect(() => {
        // polling
        // const poll = polling_client()
        // poll.startPoll()
        const signal = signal_system_client({
            id: (Math.random() * 10).toFixed(),
            username: "Amir Rahman",
            channel: "myroom",
            baseurl: "http://localhost:3000/api/signaling"
        })

        signal.startPoll()
        signal.on.data.bind((d) => {
            setmessages((v) => [...v, {...d , receivedAt : Date.now()}])
            console.log(d)
        }, false)

        window.t = signal

        window.s = (name, msg) => {
            signal.send({
                name,
                msg
            })
        }
    }, [])

    return (
        <>
            <Head>
                <title>VirtualTheatre</title>
            </Head>
            <div className="root bg-yellow-100 flex w-full min-h-screen items-center justify-center">
                <div className="flex flex-col bg-white items-center gap-6 p-20 shadow-xl font-bold">
                    <div className="text-4xl text-center leading-snug">
                        Wellcome To <span className="text-purple-600">WeWatch.com</span>
                    </div>
                    {
                        <a href={`./room/${generateRandomString(6)}`}>
                            <Button>Create Room</Button>
                        </a>
                    }
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = async (ctx) => {
    return {
        props: ctx.query
    }
}
