export default function signal_system_client(options){
    function addState(value){
        return {
            value,
            last : value,
            cbs : [],
            set(){
                let val = arguments[0]
                if(val !== undefined){
                    val = typeof val === "function" ? val(this.value) : val
                    if(val !== undefined){this.last = this.value;this.value = val}
                }
                for(let each of this.cbs){each(val||this.value)}
            },
            bind(){let [cb , initialLoad] = arguments;this.cbs.push(cb);if(initialLoad === undefined || initialLoad === true){cb(this.value)}}
        }
    }
    
    let obj = {}
    obj.pipesCount = 0
    obj.pipesAllowed = 1

    obj.id = '123'
    obj.baseurl = '' // example.com/somepoint
    obj.lastPolled = 0

    obj = Object.assign(obj , options)
    obj.on = {
        data : addState(null)
    }
    
    async function sendPoll(){
        try {
            let res = await fetch(`${obj.baseurl}?mode=polling` , {
                method : 'POST',
                body : JSON.stringify({
                    id : obj.id,
                    lastPolled : obj.lastPolled
                })
            })
            if(res.status === 200){
                res = await res.json()
                if(res.data){
                    res.data.forEach((each,i)=>{
                        obj.lastPolled = each.time
                        obj.on.data.set(each)
                    })
                }
            }
            else {
                setTimeout(()=>{
                    sendPoll()
                },1000)
                return null
            }
            obj.pipesCount--
            obj.startPoll()
            return res            
        } catch (error) {
            
        }

    }

    obj.startPoll = () => {
        sendPoll()
        // while(obj.pipesCount < obj.pipesAllowed){
        //     obj.pipesCount++
        // }
    }

    obj.send = async function(data , receiver = '*'){
        try {
            let res = fetch(`${obj.baseurl}?mode=signal_send`,{
                method : 'POST',
                body : JSON.stringify({
                    sender : obj.id.toString(),
                    receiver : receiver.toString(),
                    time : Date.now(),
                    data
                })
            })
            return res
        } catch (error) {
            
        }
    }
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