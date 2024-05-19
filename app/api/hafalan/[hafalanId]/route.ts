import hafalanService from "@/services/hafalan";

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request: Request, { params }: { params: { hafalanId: string } }) {
    const hafalanId = params.hafalanId;
    const data = await hafalanService.getHafalan(hafalanId);
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
}

export async function PUT(request: Request, { params }: { params: { hafalanId: string } }) {
    const hafalanId = params.hafalanId;
    const data = await request.json();
    await hafalanService.updateHafalan(hafalanId, data);
    return new Response('Data berhasil diupdate!', { status: 200 });
}

export async function DELETE(request: Request, { params }: { params: { hafalanId: string } }) {
    const hafalanId = params.hafalanId;
    await hafalanService.deleteHafalan(hafalanId);
    return new Response('Data berhasil dihapus!', { status: 200 });
}