import { AppointmentStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionPayload } from "@/lib/session";

const occupancySchema = z.object({
  professionalId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  patientName: z.string().trim().min(2),
  reason: z.string().trim().optional(),
});

const deleteSchema = z.object({
  appointmentId: z.number().int().positive(),
});

function buildStartsAt(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

async function requireAdmin() {
  const session = await getSessionPayload();
  return Boolean(session && session.role === "ADMIN");
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = occupancySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Revisa los datos de ocupacion." }, { status: 400 });
  }

  const room = await prisma.professional.findUnique({
    where: { id: parsed.data.professionalId },
    select: { id: true, consultoryId: true },
  });

  if (!room) {
    return NextResponse.json({ error: "Modulo no encontrado." }, { status: 404 });
  }

  const startsAt = buildStartsAt(parsed.data.date, parsed.data.time);
  const existing = await prisma.appointment.findFirst({
    where: {
      professionalId: parsed.data.professionalId,
      startsAt,
      status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
    },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json({ error: "Ese dia y horario ya esta ocupado." }, { status: 409 });
  }

  const appointment = await prisma.appointment.create({
    data: {
      patientName: parsed.data.patientName,
      patientEmail: `${parsed.data.patientName.toLowerCase().replace(/\s+/g, ".")}@agenda.local`,
      reason: parsed.data.reason || "Carga manual de administracion",
      startsAt,
      status: AppointmentStatus.CONFIRMED,
      professionalId: parsed.data.professionalId,
      consultoryId: room.consultoryId,
    },
  });

  return NextResponse.json({ ok: true, appointment }, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = occupancySchema.extend({
    appointmentId: z.number().int().positive(),
  }).safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Revisa los datos para mover el horario." }, { status: 400 });
  }

  const room = await prisma.professional.findUnique({
    where: { id: parsed.data.professionalId },
    select: { id: true, consultoryId: true },
  });

  if (!room) {
    return NextResponse.json({ error: "Modulo no encontrado." }, { status: 404 });
  }

  const startsAt = buildStartsAt(parsed.data.date, parsed.data.time);
  const existing = await prisma.appointment.findFirst({
    where: {
      id: { not: parsed.data.appointmentId },
      professionalId: parsed.data.professionalId,
      startsAt,
      status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
    },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json({ error: "Ese nuevo dia y horario ya esta ocupado." }, { status: 409 });
  }

  const appointment = await prisma.appointment.update({
    where: { id: parsed.data.appointmentId },
    data: {
      patientName: parsed.data.patientName,
      patientEmail: `${parsed.data.patientName.toLowerCase().replace(/\s+/g, ".")}@agenda.local`,
      reason: parsed.data.reason || "Editado manualmente por administracion",
      startsAt,
      status: AppointmentStatus.CONFIRMED,
      professionalId: parsed.data.professionalId,
      consultoryId: room.consultoryId,
    },
  });

  return NextResponse.json({ ok: true, appointment });
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = deleteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Reserva invalida." }, { status: 400 });
  }

  await prisma.appointment.update({
    where: { id: parsed.data.appointmentId },
    data: { status: AppointmentStatus.CANCELED },
  });

  return NextResponse.json({ ok: true });
}
