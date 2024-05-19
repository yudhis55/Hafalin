import profileService from "@/services/profile";

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request: Request, { params }: { params: { profileId: string } }) {
    const profileId = params.profileId;
    const data = await profileService.getProfile(profileId);
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
}

export async function PUT(request: Request, { params }: { params: { profileId: string } }) {
    const profileId = params.profileId;
    const data = await request.json();
    await profileService.updateProfile(profileId, data);
    return new Response('Data berhasil diupdate!', { status: 200 });
}

export async function DELETE(request: Request, { params }: { params: { profileId: string } }) {
    const profileId = params.profileId;
    await profileService.deleteProfile(profileId);
    return new Response('Data berhasil dihapus!', { status: 200 });
}