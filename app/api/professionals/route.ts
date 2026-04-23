import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const specialty = searchParams.get("specialty");

  const professionals = await prisma.professional.findMany({
    where: specialty ? { specialty: { contains: specialty } } : undefined,
    include: {
      consultory: true,
      schedules: {
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      },
    },
    orderBy: { fullName: "asc" },
  });

  return NextResponse.json({ professionals });
}
