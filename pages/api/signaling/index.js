import { signal_system_server } from "../../../scripts/signal_system/signal_system_server"

const signal = signal_system_server({
    pollinterval : 8000
})

export default async function signaling(req, res) {
    signal.connectSignalSystem(req ,res)
}