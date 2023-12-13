import Mainpage from "../../components/mainpage/Mainpage"

export default function Room(props) {
    return (
        <div>
            <Mainpage room_id={props.room_id} />
        </div>
    )
}

export const getServerSideProps = async (ctx) => {
    return {
        props: ctx.query
    }
}
