import profileService from "@/services/profile";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(request: NextRequest) {
    const data = await profileService.getDaftarProfile();
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
}

export async function POST(request: Request) {
    const data = await request.json();
    await profileService.addProfile(data);
    return new Response('Data berhasil ditambahkan!', { status: 201 });
}