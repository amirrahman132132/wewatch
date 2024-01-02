export async function GET(req){
    const params = req.nextUrl.searchParams
    const id = params.get('id')
    console.log(id)
    return new Response(JSON.stringify({data : 'ok'}),{
        status : 200,

    })
}

export async function POST(req){
    const params = req.nextUrl.searchParams
    const id = params.get('id')
    const body = await req.json()
    return new Response(JSON.stringify({data : 'ok'}))
}