// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

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

const count = addState(0)

function minmaxRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export default function handler(req, res) {
    const rand = minmaxRandom(3000 , 6000)
    setTimeout(()=>{
        res.status(200).json({ delayedBy : rand })
    },rand)
}