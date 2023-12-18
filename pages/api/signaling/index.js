import signal_system from "../../../scripts/signal_system/signal_system_server"

const signal = signal_system()

export default async function signaling(req, res) {
    signal.connectSignalSystem(req ,res)
}