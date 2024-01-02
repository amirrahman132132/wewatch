"use client"
import Script from "next/script"
import { useEffect, useRef, useState } from "react"

export default function Uploader() {
    const widget = useRef()
    const [photos, setphotos] = useState([])

    const userInfo = useRef({
        name: "dfew2b3gq",
        preset: "ml_default",
        api_key: "641711485986283"
    })

    function handleUpload() {
        cloudinary.openUploadWidget(
            {
                cloudName: userInfo.current.name,
                uploadPreset: userInfo.current.preset
            },
            (error, result) => {
                // Handle upload results
            }
        )
    }

    async function handleGetPhotos() {
        // const url = `https://api.cloudinary.com/v1_1/${userInfo.current.name}/resources/image/upload`
        const url = `https://res.cloudinary.com/aa9e3a09e6c86693f4e91337d0efa5/image/fetch/`
        let res = await fetch( url , {
            headers: {
                "Access-Control-Allow-Origin": "https://api.cloudinary.com",
                'Authorization': `Basic ${btoa(`${userInfo.current.api_key}:`)}`
            }
        })
        res = await res.json()
        console.log(res)
    }
    useEffect(() => {}, [])
    return (
        <>
            <Script src="https://upload-widget.cloudinary.com/global/all.js" />
            <div className="Uploader m-5">
                <div className="buttons flex flex-col gap-1 w-40">
                    <button onClick={handleUpload} className="bg-blue-600 px-4 py-2 text-white rounded-sm">
                        Upload
                    </button>

                    <button onClick={handleGetPhotos} className="bg-blue-600 px-4 py-2 text-white rounded-sm">
                        Get Photos
                    </button>
                </div>
                <div className="photos">
                    {photos.map((each, i) => {
                        return (
                            <div key={i} className="each">
                                {/* {console.log} */}
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
