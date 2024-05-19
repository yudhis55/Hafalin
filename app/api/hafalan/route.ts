import hafalanService from "@/services/hafalan";

export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(request: Request) {
    const data = await hafalanService.getDaftarHafalan();
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
}

export async function POST(request: Request) {
    const data = await request.json();
    await hafalanService.addHafalan(data);
    return new Response('Data berhasil ditambahkan!', { status: 201 });
}