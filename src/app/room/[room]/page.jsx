import Mainpage from "@/components/mainpage/Mainpage";
import Head from "next/head";

export default function Room(props) {
    const id = props.params.room
    return (
        <div>
            <Head></Head>
            <Mainpage room_id={id} /> 
        </div>
    )
}