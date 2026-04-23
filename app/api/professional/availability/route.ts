import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionPayload } from "@/lib/session";

const scheduleSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  telehealth: z.boolean().optional().default(false),
});

const bodySchema = z.object({
  schedules: z.array(scheduleSchema).min(1),
});

export async function PATCH(request: Request) {
  const session = await getSessionPayload();

  if (!session || session.role !== "PROFESSIONAL" || !session.professionalId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Disponibilidad invalida." }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.schedule.deleteMany({ where: { professionalId: session.professionalId } });

    await tx.schedule.createMany({
      data: parsed.data.schedules.map((item) => ({
        dayOfWeek: item.dayOfWeek,
        startTime: item.startTime,
        endTime: item.endTime,
        telehealth: item.telehealth,
        professionalId: session.professionalId!,
      })),
    });
  });

  return NextResponse.json({ ok: true });
}
