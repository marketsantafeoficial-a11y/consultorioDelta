import { AppointmentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const APPOINTMENT_DURATION_MINUTES = 60;

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function toDate(date: Date, totalMinutes: number) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  normalized.setMinutes(totalMinutes);
  return normalized;
}

export async function getAvailabilityByDate(professionalId: number, date: Date) {
  const day = date.getDay();

  const [schedules, appointments] = await Promise.all([
    prisma.schedule.findMany({
      where: { professionalId, dayOfWeek: day },
      orderBy: { startTime: "asc" },
    }),
    prisma.appointment.findMany({
      where: {
        professionalId,
        startsAt: {
          gte: toDate(date, 0),
          lt: toDate(date, 24 * 60),
        },
        status: {
          in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
        },
      },
      select: { startsAt: true },
    }),
  ]);

  const occupiedTimes = new Set(appointments.map((item) => item.startsAt.getTime()));
  const slots: Date[] = [];

  for (const schedule of schedules) {
    const start = toMinutes(schedule.startTime);
    const end = toMinutes(schedule.endTime);

    for (let current = start; current + APPOINTMENT_DURATION_MINUTES <= end; current += APPOINTMENT_DURATION_MINUTES) {
      const slot = toDate(date, current);
      if (!occupiedTimes.has(slot.getTime())) {
        slots.push(slot);
      }
    }
  }

  return slots;
}

export async function ensureSingleActiveAppointment(patientEmail: string) {
  const activeAppointment = await prisma.appointment.findFirst({
    where: {
      patientEmail,
      startsAt: { gte: new Date() },
      status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
    },
    select: { id: true },
  });

  if (activeAppointment) {
    throw new Error("Este paciente ya tiene un turno activo. Debe cancelar antes de reservar otro.");
  }
}

export async function createPendingAppointment(input: {
  patientName: string;
  patientEmail: string;
  reason: string;
  startsAt: Date;
  professionalId: number;
}) {
  return prisma.$transaction(async (tx) => {
    const professional = await tx.professional.findUnique({
      where: { id: input.professionalId },
      select: { id: true, consultoryId: true },
    });

    if (!professional) {
      throw new Error("Consultorio no encontrado.");
    }

    const existing = await tx.appointment.findFirst({
      where: {
        professionalId: input.professionalId,
        startsAt: input.startsAt,
        status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
      },
      select: { id: true },
    });

    if (existing) {
      throw new Error("Ese horario ya no esta disponible.");
    }

    const patientActive = await tx.appointment.findFirst({
      where: {
        patientEmail: input.patientEmail,
        startsAt: { gte: new Date() },
        status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
      },
      select: { id: true },
    });

    if (patientActive) {
      throw new Error("Este cliente ya tiene una reserva activa.");
    }

    return tx.appointment.create({
      data: {
        patientName: input.patientName,
        patientEmail: input.patientEmail,
        reason: input.reason,
        startsAt: input.startsAt,
        professionalId: input.professionalId,
        consultoryId: professional.consultoryId,
        status: AppointmentStatus.PENDING,
      },
    });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}
