import Mainpage from "../../components/mainpage/Mainpage"

export default function Room(props) {
    return (
        <div>
            <Mainpage room_id={props.room_id} />
        </div>
    )
}

export const getServerSideProps = async (ctx) => {
    // Set CORS headers to allow requests from any origin
    ctx.res.setHeader('Access-Control-Allow-Origin', '*');
    ctx.res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    ctx.res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    return {
        props: ctx.query
    }
}
