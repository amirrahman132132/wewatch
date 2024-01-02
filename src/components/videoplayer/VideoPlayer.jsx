import { useRef , useState , useEffect } from "react"

export default function VideoPlayer({reff , videoLink}) {
    const [playing , setplaying] = useState(false)
    const [time , settime] = useState(0)
    const videoEl = useRef()

    // video player events

    useEffect(()=>{
        
    },[playing])

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

    //
    useEffect(() => {
        const vEl = videoEl.current

        vEl.addEventListener(
            "click",
            (e) => {
                playerInfo.current.changedByUser = true
            },
            true
        )

        document.addEventListener("click", async (e) => {})

        let lastEventTime = 0

        console.log("555")

        // sending data
        vEl.addEventListener("playing", (e) => {
            if (Date.now() - lastEventTime <= 400) return
            lastEventTime = Date.now()
            playerInfo.current.timeNow = Date.now()
            playerInfo.current.playing = true
            if (playerInfo.current.changedByUser === false) return
            signal.send(playerData())
        })

        vEl.addEventListener("pause", (e) => {
            if (Date.now() - lastEventTime <= 400) return
            lastEventTime = Date.now()
            playerInfo.current.timeNow = Date.now()
            playerInfo.current.playing = false
            if (playerInfo.current.changedByUser === false) return
            signal.send(playerData())
        })

        vEl.addEventListener("seeked", (e) => {
            if (Date.now() - lastEventTime <= 400 || vEl.currentTime < 1) return
            lastEventTime = Date.now()
            if (vEl.playing) vEl.pause()
            playerInfo.current.timeNow = Date.now()
            playerInfo.current.playing = false
            if (playerInfo.current.changedByUser === false) return
            signal.send(playerData())
        })

        reff.current = videoEl.current
    }, [])

    return (
        <div className="videoplayer">
            <video ref={videoEl} src={videoLink} className="w-full" controls autoPlay={false}></video>
        </div>
    )
}
