export function signal_system_server(options = {}) {
    let obj = {}
    obj.signals = []
    obj.pollinterval = 5000

    obj.signalCallbacks = new Set([])

    obj.resolvers = {
        'nextjs' : function(req, res , data){
            if(res.headersSent) return
            try {
                res.status(200).json({ data })
            } catch (error) {
                const errorMessage = 'desynched request dropped'
                console.log(errorMessage)
                res.status(500).json({ data })
            }
        }
    }

    obj.resolver = obj.resolvers.nextjs
    
    obj = Object.assign(obj , options)

    function wait(time) {
        return new Promise((res, rej) => {
            setTimeout(() => {
                res(time)
            }, time)
        })
    }

    function addSignal(sender, receiver, time, data) { // {sender : '213z2x1c' , reciever : '2a1sd12' , time : 1321512465 , data : {}}
        obj.signals.push({
            receiver,
            sender,
            time,
            data
        })
        obj.signalCallbacks.forEach(each=>each())
    }

    obj.addSignal = addSignal
    obj.signalFilters = {
        'default' : (incommingPollReq , eachSignal)=>{
            return eachSignal.receiver === incommingPollReq.receiver
        }
    }
    obj.signalFilter = obj.signalFilters.default
    
    obj.getSignal = function(incommingPollReq) {
        const res = obj.signals.filter((eachSignal, i) => {
            const selected = eachSignal.time > incommingPollReq.lastPolled && obj.signalFilter(incommingPollReq , eachSignal)
            return selected
        })
        return res.length > 0 ? res : null
    }

    // polling
    
    async function addPollRequest(req, res) {
        const incommingPollReq = JSON.parse(req.body)
        
        // signal checking callback
        function signalTempFunction(){
            const signalData = obj.getSignal(incommingPollReq)
            if(signalData){
                obj.resolver(req,res,signalData)
                obj.signalCallbacks.delete(signalTempFunction)
            }
        }
        obj.signalCallbacks.add(signalTempFunction)
        
        signalTempFunction()
        
        await wait(obj.pollinterval)
        obj.signalCallbacks.delete(signalTempFunction)
        obj.resolver(req , res , false)
    }

    async function addSignalSendRequest(req , res){
        // adding signal
        const incommingSignal = JSON.parse(req.body)
        obj.addSignal(incommingSignal.sender, incommingSignal.receiver, incommingSignal.time, incommingSignal.data)
        obj.resolver(req , res , true)
    }

    obj.connectSignalSystem = async function(req , res){
        if (typeof req.query.mode === 'string' && req.query.mode === 'polling') {
            addPollRequest(req , res)
        }
        else if (typeof req.query.mode === 'string' && req.query.mode === 'signal_send') {
            addSignalSendRequest(req , res)
        }
    }

    return obj
}

// example use

// import signal_system from "../../../scripts/signal_system/signal_system_server"

// const signal = signal_system()

// export default async function signaling(req, res) {
//     let gParms = req.query,
//     pParms = req.body
    
//     signal.connectSignalSystem(req ,res)
//     there are resolvers added and you can also make yours
// }