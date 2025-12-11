import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const hosts = await prisma.hosts.findMany();
    return NextResponse.json(hosts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { hostId, userId, date } = body;

    const booking = await prisma.booking.create({
      data: {
        hostid: hostId,
        userid: userId,
        date: new Date(date),
        status: "pending",
      },
    });

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
