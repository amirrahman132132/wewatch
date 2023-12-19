import Head from "next/head";
import Mainpage from "../../components/mainpage/Mainpage"

export default function Room(props) {
    return (
        <div>
            <Head>
                <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta>
            </Head>
            <Mainpage room_id={props.room_id} />
        </div>
    )
}

export const getServerSideProps = async (ctx) => {
    // Set CORS headers to allow requests from any origin
    ctx.res.setHeader('Access-Control-Allow-Origin', '*');
    ctx.res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    ctx.res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.res.setHeader('Content-Security-Policy', 'upgrade-insecure-requests');
    return {
        props: ctx.query
    }
}
