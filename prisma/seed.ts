import { AppointmentStatus, PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth";

const prisma = new PrismaClient();

async function main() {
  await prisma.authUser.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.professional.deleteMany();
  await prisma.consultory.deleteMany();

  const defaultPasswordHash = await hashPassword("demo1234");

  const centro = await prisma.consultory.create({
    data: {
      name: "Centro Vida Norte",
      slug: "centro-vida-norte",
      city: "Palermo",
      address: "Armenia 1487",
      phone: "+54 11 4981-3920",
      description:
        "Equipo interdisciplinario para terapia individual, pareja y familia.",
    },
  });

  const puerto = await prisma.consultory.create({
    data: {
      name: "Consultorio Puerto Salud",
      slug: "consultorio-puerto-salud",
      city: "Puerto Madero",
      address: "Juana Manso 740",
      phone: "+54 11 4112-8440",
      description:
        "Atencion presencial y online para adultos, adolescentes y orientacion vocacional.",
    },
  });

  const profileA = await prisma.professional.create({
    data: {
      fullName: "Lic. Agustina Ferraro",
      specialty: "Psicoterapia Cognitivo Conductual",
      bio: "Especialista en ansiedad y estres laboral con enfoque breve.",
      photoUrl: "https://images.unsplash.com/photo-1601582589907-f92af5ed9db8?auto=format&fit=crop&w=600&q=80",
      serves: "Adultos",
      yearsPractice: 8,
      email: "agustina.ferraro@centrovida.ar",
      colorToken: "sunset",
      consultoryId: centro.id,
      schedules: {
        create: [
          { dayOfWeek: 1, startTime: "09:00", endTime: "14:00", telehealth: true },
          { dayOfWeek: 3, startTime: "11:00", endTime: "18:00", telehealth: false },
        ],
      },
    },
  });

  const profileB = await prisma.professional.create({
    data: {
      fullName: "Lic. Tomas Ibarra",
      specialty: "Terapia de Pareja",
      bio: "Acompana procesos vinculares y comunicacion en crisis.",
      photoUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80",
      serves: "Parejas y adultos",
      yearsPractice: 11,
      email: "tomas.ibarra@puertosalud.ar",
      colorToken: "forest",
      consultoryId: puerto.id,
      schedules: {
        create: [
          { dayOfWeek: 2, startTime: "10:00", endTime: "17:00", telehealth: true },
          { dayOfWeek: 5, startTime: "13:00", endTime: "20:00", telehealth: false },
        ],
      },
    },
  });

  await prisma.appointment.createMany({
    data: [
      {
        patientName: "Camila R.",
        patientEmail: "camila@email.com",
        reason: "Gestion de ansiedad",
        startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        status: AppointmentStatus.CONFIRMED,
        consultoryId: centro.id,
        professionalId: profileA.id,
      },
      {
        patientName: "Nicolas P.",
        patientEmail: "nicolas@email.com",
        reason: "Sesion de pareja",
        startsAt: new Date(Date.now() + 1000 * 60 * 60 * 30),
        status: AppointmentStatus.PENDING,
        consultoryId: puerto.id,
        professionalId: profileB.id,
      },
      {
        patientName: "Valentina S.",
        patientEmail: "valen@email.com",
        reason: "Orientacion vocacional",
        startsAt: new Date(Date.now() + 1000 * 60 * 60 * 54),
        status: AppointmentStatus.CONFIRMED,
        consultoryId: centro.id,
        professionalId: profileA.id,
      },
    ],
  });

  await prisma.authUser.createMany({
    data: [
      {
        email: "admin@consultorios.local",
        passwordHash: defaultPasswordHash,
        role: "ADMIN",
      },
      {
        email: "agustina.ferraro@centrovida.ar",
        passwordHash: defaultPasswordHash,
        role: "PROFESSIONAL",
        professionalId: profileA.id,
      },
      {
        email: "tomas.ibarra@puertosalud.ar",
        passwordHash: defaultPasswordHash,
        role: "PROFESSIONAL",
        professionalId: profileB.id,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
