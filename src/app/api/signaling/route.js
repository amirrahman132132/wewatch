import { signal_system_server } from "../../../../scripts/signal_system/signal_system_server"

if(typeof global.signal !== 'undefined'){
    global.signal = signal_system_server({
        pollinterval : 5000
    })
}

export async function POST(req){
    const res = await global.signal.handleRequest(req)
    return new Response(JSON.stringify(res))
}