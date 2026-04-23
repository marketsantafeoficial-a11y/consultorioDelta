import { NextResponse } from "next/server";
import { createPendingAppointment } from "@/lib/appointments";
import { z } from "zod";

const appointmentSchema = z.object({
  patientName: z.string().min(2),
  patientEmail: z.string().email(),
  reason: z.string().min(4),
  startsAt: z.string(),
  professionalId: z.number().int().positive(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = appointmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Datos de reserva invalidos." }, { status: 400 });
    }

    const startsAt = new Date(parsed.data.startsAt);
    if (Number.isNaN(startsAt.getTime()) || startsAt <= new Date()) {
      return NextResponse.json({ error: "Horario invalido." }, { status: 400 });
    }

    const appointment = await createPendingAppointment({
      patientName: parsed.data.patientName,
      patientEmail: parsed.data.patientEmail.toLowerCase(),
      reason: parsed.data.reason,
      startsAt,
      professionalId: parsed.data.professionalId,
    });

    return NextResponse.json({ ok: true, appointment });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo reservar.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
