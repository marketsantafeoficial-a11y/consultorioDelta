import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionPayload } from "@/lib/session";

export async function GET() {
  const session = await getSessionPayload();

  if (!session || session.role !== "PROFESSIONAL" || !session.professionalId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      professionalId: session.professionalId,
    },
    include: {
      consultory: true,
    },
    orderBy: {
      startsAt: "asc",
    },
    take: 30,
  });

  return NextResponse.json({ appointments });
}
