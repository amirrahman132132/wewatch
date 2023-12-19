import Head from "next/head"
import Image from "next/image"

import { Button } from "../components/corepagedesign/CorePageComponents"
import { generateRandomString } from "../scripts/common"
import { useEffect, useState } from "react"

export default function Home() {
    const [messages, setmessages] = useState([])

    useEffect(() => {

    }, [])

    return (
        <>
            <Head>
                <title>wewatch</title>
            </Head>
            <div className="root bg-yellow-100 flex w-full min-h-screen items-center justify-center">
                <div className="flex flex-col bg-white items-center gap-6 p-20 shadow-xl font-bold">
                    <div className="text-4xl text-center leading-snug">
                        Wellcome To <span className="text-purple-600">WeWatch plll</span>
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