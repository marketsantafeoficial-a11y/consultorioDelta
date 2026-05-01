import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionPayload } from "@/lib/session";

const scheduleSchema = z.object({
  professionalId: z.number().int().positive(),
  schedules: z.array(z.object({
    dayOfWeek: z.number().int().min(1).max(6),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
  })),
});

export async function PATCH(request: Request) {
  const session = await getSessionPayload();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = scheduleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Horarios invalidos." }, { status: 400 });
  }

  const room = await prisma.professional.findUnique({
    where: { id: parsed.data.professionalId },
    select: { id: true },
  });

  if (!room) {
    return NextResponse.json({ error: "Modulo no encontrado." }, { status: 404 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.schedule.deleteMany({
      where: { professionalId: parsed.data.professionalId },
    });

    if (parsed.data.schedules.length > 0) {
      await tx.schedule.createMany({
        data: parsed.data.schedules.map((schedule) => ({
          professionalId: parsed.data.professionalId,
          dayOfWeek: schedule.dayOfWeek,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          telehealth: false,
        })),
      });
    }
  });

  return NextResponse.json({ ok: true });
}
