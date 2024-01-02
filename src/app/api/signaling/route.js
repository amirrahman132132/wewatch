import { signal_system_server } from "../../../../scripts/signal_system/signal_system_server"

const signal = signal_system_server({
    pollinterval : 5000
})

export async function POST(req){
    const res = await signal.handleRequest(req)
    return new Response(JSON.stringify(res))
}