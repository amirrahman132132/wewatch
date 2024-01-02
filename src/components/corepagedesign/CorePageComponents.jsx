import { useEffect, useRef } from "react"

export function Section({ children }) {
    return (
        <>
            <div className="h-max w-full flex flex-col items-center justify-center" element_name="section">
                <div className="container flex flex-col gap-[16px] max-w-[1000px] h-full" element_name="container">
                    {children}
                </div>
            </div>
        </>
    )
}

export function Input(props){
    const {reff} = props

    return (
        <>
            <div className="input w-full p-2 px-4 h-10 text-gray-600">
                <input ref={reff} {...props} className="w-full h-full bg-transparent outline-none" type="text" />
            </div>
        </>
    )
}

export function Button(props){
    const { children } = props
    return (
        <>
            <button className="w-max p-2 px-4 border border-gray-300 bg-blue-800 text-white" {...props}>{children}</button>
        </>
    )
}