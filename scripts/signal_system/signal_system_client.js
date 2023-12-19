export default function signal_system_client(options = {}) {
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

    let obj = {}
    obj.pipesCount = 0
    obj.pipesAllowed = 1

    obj.getRandomId = function (len = 8) {
        return ((Math.random() * 5000) + Date.now()).toString().substring(0, len)
    }

    obj.id = obj.getRandomId()
    obj.channel = ''
    obj.baseurl = '' // example.com/somepoint
    obj.lastPolled = 0
    obj.pollingSleepAfter = 5

    obj = Object.assign(obj, options)
    obj.on = {
        data: addState(null),
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
            let res = await fetch(`${obj.baseurl}?mode=polling`, {
                method: 'POST',
                body: JSON.stringify({
                    receiver: obj.channel ? obj.channel : obj.id,
                    lastPolled: obj.lastPolled
                })
            })
            if (res.status === 200) {
                res = await res.json()
                if (res.data) {
                    res.data.forEach((each, i) => {
                        obj.lastPolled = each.time
                        obj.on.data.set(each)
                    })
                }
                return { data: true }
            }
            return { data: true }
        } catch (error) {
            return { data: false }
        }
    }

    obj.startPoll = async () => {
        const res = await sendPoll()
        if (res.data) {
            obj.startPoll()
        }
        else {
            await wait(3000)
            obj.startPoll()
            console.error(`connection failed reconnecting...`)
        }
    }

    obj.manualPoll = () => {
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

    // polling sleep manage

    obj.lastResponses = []
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