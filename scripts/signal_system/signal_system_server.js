export function signal_system_server(options = {}) {
    let obj = {}
    obj.signals = []
    obj.pollDuration = 5000

    obj.signalCallbacks = new Set([])

    obj = Object.assign(obj, options)

    function wait(time) {
        return new Promise((res, rej) => {
            setTimeout(() => {
                res(time)
            }, time)
        })
    }

    async function addSignal(sender, receiver, time, data) {
        obj.signals.push({
            receiver,
            sender,
            time,
            data
        })
        obj.signalCallbacks.forEach(each => each())
    }

    function getSignal(lastPolled, receiver) {
        const res = obj.signals.filter((eachSignal, i) => {
            const selected = eachSignal.time > lastPolled && eachSignal.receiver === receiver
            return selected
        })
        return res.length > 0 ? res : null
    }

    // polling

    async function addPollRequest(lastPolled, receiver) {
        return new Promise(async (res,rej)=>{
            function signalEvaluation() {
                const signalData = getSignal(lastPolled, receiver)
                if (signalData) {
                    res({data : signalData})
                    obj.signalCallbacks.delete(signalEvaluation)
                }
            }
            signalEvaluation()

            obj.signalCallbacks.add(signalEvaluation)

            await wait(obj.pollDuration)

            obj.signalCallbacks.delete(signalEvaluation)
            res({ data: null })            
        })
    }

    async function onConnectionRequest(req) {
        // nextjs 14 integration
        const params = req.nextUrl.searchParams

        // manage polling request
        if (params.get('mode') === 'polling') {
            const { lastPolled, receiver } = await req.json()
            return await addPollRequest(lastPolled, receiver)
        }

        // managing send signal
        if (params.get('mode') === 'signal_send') {
            const { sender, receiver, time, data } = await req.json()
            addSignal(sender, receiver, time, data)
            return { data: 'ok' }
        }

        return { data: 'wrong request' }
    }

    obj.handleRequest = onConnectionRequest

    return obj
}

// example use

// import { signal_system_server } from "../../../../scripts/signal_system/signal_system_server"

// const signal = signal_system_server({
//     pollinterval : 8000
// })

// export async function POST(req){
//     const res = await signal.handleRequest(req)
//     return new Response(JSON.stringify(res))
// }