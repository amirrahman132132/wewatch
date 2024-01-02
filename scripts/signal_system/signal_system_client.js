export default function signal_system_client(options) {
    function addState(value) {
        return {
            value,
            last: value,
            cbs: [],
            set() {
                let val = arguments[0]
                if (val !== undefined) {
                    val = typeof val === "function" ? val(this.value) : val
                    if (val !== undefined) { this.last = this.value; this.value = val }
                }
                for (let each of this.cbs) { each(val || this.value) }
            },
            bind() { let [cb, initialLoad] = arguments; this.cbs.push(cb); if (initialLoad === undefined || initialLoad === true) { cb(this.value) } }
        }
    }

    const obj = {}
    obj.pipesCount = 0
    obj.pipesAllowed = 1

    function getRandomId(len = 8) {
        return ((Math.random() * 5000).toString() + Date.now()).toString().substring(0, len)
    }

    obj.id = getRandomId()
    obj.channel = ''
    obj.baseurl = '' // example.com/somepoint
    obj.lastPolled = 0
    obj.pollingSleepAfter = 5

    Object.assign(obj, options)

    obj.on = {
        data: addState(null),
        polling : addState(false),
        isSuccess: addState(true),
        error: addState(null),
        response: addState(null),
        sleeping: addState(false)
    }

    function wait(time) {
        return new Promise((res, rej) => {
            setTimeout(() => {
                res(time)
            }, time)
        })
    }

    async function sendPoll() {
        try {
            obj.on.polling.set(true)
            let url = `${obj.baseurl}?mode=polling`,
                res = await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({
                        receiver: obj.channel ? obj.channel : obj.id,
                        lastPolled: obj.lastPolled
                    })
                })
            if (res.status === 200) {
                res = await res.json()
                if (res.data) {
                    // console.log(res.data)

                    res.data.forEach((each, i) => {
                        each.data.info = {
                            sender: each.sender,
                            receiver: each.receiver,
                            time: each.time,
                            initial_load : obj.lastPolled <= 0,
                            is_me : obj.id === each.sender
                        }

                        obj.lastPolled = each.time
                        obj.on.data.set(each.data)
                    })
                }
                obj.on.polling.set(false)
            }
            obj.on.polling.set(false)
            return { data: true }
        } catch (error) {
            obj.on.polling.set(false)
            return { data: false }
        }
    }

    obj.startPoll = async () => {
        const res = await sendPoll()
        if (res.data === true) {
            await wait(50)
            obj.startPoll()
        }
        else {
            await wait(3000)
            obj.startPoll()
            console.error(`connection failed reconnecting...`)
        }
    }

    obj.manualPoll = async () => {
        obj.on.sleeping.set(false)
        return sendPoll
    }

    obj.send = async function (data, receiver = obj.channel) {
        const timeNow = Date.now()
        try {
            let res = fetch(`${obj.baseurl}?mode=signal_send`, {
                method: 'POST',
                body: JSON.stringify({
                    sender: obj.id.toString(),
                    receiver: receiver,
                    time: timeNow,
                    data
                })
            })
            return res
        } catch (error) {

        }
    }

    obj.setChannel = async function(name){
        obj.channel = name
        obj.lastPolled = 0
        return obj.manualPoll()
    }

    // polling sleep manage

    let lastResponses = []
    function managePollingSleep() {
        obj.on.response.bind(d => {
            console.log(d)
        }, false)
    }
    managePollingSleep()

    return obj
}

// // example use
// const signal = signal_system_client({
//     id: (Math.random() * 10).toFixed(),
//     baseurl: "http://localhost:3000/api/signaling"
// })

// signal.startPoll()
// signal.on.data.bind((d) => {
//     // setmessages(v=>[...v , `${d.id}`])
//     console.log(d)
// }, false)