"use client"

import Head from "next/head"
import Image from "next/image"

import { useEffect, useRef, useState } from "react"
import { Button } from "../corepagedesign/CorePageComponents"
import { generateRandomString } from "../../../scripts/common"
import ChatBody from "../chatsystem"
import Link from "next/link"

export default function WellcomePageComponent() {
    const roomLink = useRef('')

    useEffect(()=>{
        roomLink.current = `./room/${generateRandomString(6)}`
    },[])

    return (
        <>
            <Head>
                <title>wewatch</title>
            </Head>
            <div className="root bg-yellow-100 flex flex-col gap-4 w-full min-h-screen items-center justify-center">
                <ChatBody />
                <div className="flex flex-col bg-white items-center gap-6 p-20 shadow-xl font-bold">
                    <div className="text-4xl text-center leading-snug">
                        Wellcome To <span className="text-purple-600">WeWatch plll</span>
                    </div>
                    {
                        <Link href={roomLink.current}>
                            <Button>Create Room</Button>
                        </Link>
                    }
                </div>
            </div>
        </>
    )
}