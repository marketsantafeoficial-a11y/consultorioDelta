import { prisma } from "./prisma";

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
      take: 6,
    }),
  ]);

  return {
    consultories,
    professionals,
    upcomingAppointments,
  };
}
