export async function POST(req){
    const res = await global.signal.handleRequest(req)
    return new Response(JSON.stringify(res))
}