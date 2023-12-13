import { useEffect } from "react"

export default function Title({value}){
    document.querySelector("title").innerHTML = value
}