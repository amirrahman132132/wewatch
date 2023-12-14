import Head from "next/head"
import Image from "next/image"

import { Button } from "../components/corepagedesign/CorePageComponents"
import { generateRandomString } from "../common"

export default function Home() {
    return (
        <>
            <Head><title>VirtualTheatre</title></Head>
            <div className="root bg-yellow-100 flex w-full min-h-screen items-center justify-center">
                <div className="flex flex-col bg-white items-center gap-6 p-20 shadow-xl font-bold">
                    <div className="text-4xl text-center leading-snug">Wellcome To <span className="text-purple-600">WeWatch.com</span></div>
                    <a href={`./room/${generateRandomString(10)}`}><Button>Create Room</Button></a>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = async (ctx) => {
    ctx.res.setHeader("Cache-Control", "no-store, max-age=0")
    return {
        props: ctx.query
    }
}
