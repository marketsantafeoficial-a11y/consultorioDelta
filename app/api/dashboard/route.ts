import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionPayload } from "@/lib/session";

export async function GET() {
  const session = await getSessionPayload();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const [consultories, professionals, appointments] = await Promise.all([
    prisma.consultory.count(),
    prisma.professional.count(),
    prisma.appointment.findMany({
      include: {
        consultory: true,
        professional: true,
      },
      orderBy: { startsAt: "asc" },
      take: 15,
    }),
  ]);

  return NextResponse.json({
    metrics: { consultories, professionals, appointments: appointments.length },
    appointments,
  });
}
