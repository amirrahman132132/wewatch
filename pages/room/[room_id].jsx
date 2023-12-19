import Head from "next/head";
import Mainpage from "../../components/mainpage/Mainpage"

export default function Room(props) {
    return (
        <div>
            <Head>
            </Head>
            <Mainpage room_id={props.room_id} />
        </div>
    )
}

export const getServerSideProps = async (ctx) => {
    // Set CORS headers to allow requests from any origin

    return {
        props: ctx.query
    }
}
