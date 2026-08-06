import { prisma } from "./prisma";
import { isSpaceResource } from "./resource-kind";

const AVAILABILITY_DAYS = [1, 2, 3, 4, 5, 6]; // Lunes a Sabado
const AVAILABILITY_MODULES = [
  { id: "manana", label: "Modulo MANANA", time: "9 a 12 hs", startTime: "09:00" },
  { id: "mediodia", label: "Modulo MEDIODIA", time: "12 a 16 hs", startTime: "12:00" },
  { id: "tarde", label: "Modulo TARDE", time: "16 a 20 hs", startTime: "16:00" },
];

export async function getConsultorioAvailability() {
  const spaces = await prisma.professional.findMany({
    where: {
      OR: [
        { fullName: { contains: "consultorio", mode: "insensitive" } },
        { fullName: { contains: "oficina", mode: "insensitive" } },
        { fullName: { contains: "sala", mode: "insensitive" } },
        { specialty: { contains: "consultorio", mode: "insensitive" } },
        { specialty: { contains: "oficina", mode: "insensitive" } },
        { specialty: { contains: "sala", mode: "insensitive" } },
      ],
    },
    include: { schedules: true },
    orderBy: { fullName: "asc" },
  });

  return spaces
    .filter((space) => isSpaceResource(space))
    .map((space) => ({
      id: String(space.id),
      name: space.fullName,
      modules: AVAILABILITY_MODULES.map((module) => ({
        id: module.id,
        label: module.label,
        time: module.time,
        days: AVAILABILITY_DAYS.map((dayOfWeek) =>
          space.schedules.some(
            (schedule) => schedule.dayOfWeek === dayOfWeek && schedule.startTime === module.startTime,
          ),
        ),
      })),
    }));
}

export async function getDashboardData() {
  const [consultories, professionals, upcomingAppointments] = await Promise.all([
    prisma.consultory.findMany({
      include: {
        professionals: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.professional.findMany({
      include: {
        consultory: true,
        schedules: true,
      },
      orderBy: {
        fullName: "asc",
      },
    }),
    prisma.appointment.findMany({
      include: {
        consultory: true,
        professional: true,
      },
      where: {
        startsAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        startsAt: "asc",
      },
      take: 60,
    }),
  ]);

  return {
    consultories,
    professionals,
    upcomingAppointments,
  };
}
