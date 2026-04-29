import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Limpiando base de datos...");
  await prisma.appointment.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.authUser.deleteMany();
  await prisma.professional.deleteMany();
  await prisma.consultory.deleteMany();

  console.log("Creando consultorios...");
  const sedeCentro = await prisma.consultory.create({
    data: {
      name: "Delta City Bell",
      slug: "delta-city-bell",
      city: "City Bell",
      address: "Cantilo N 146",
      phone: "221 477 8280",
      description: "Consultorios y oficinas equipadas en el centro de City Bell.",
    },
  });

  const sedeCityBell = await prisma.consultory.create({
    data: {
      name: "Delta Anexo",
      slug: "delta-anexo",
      city: "City Bell",
      address: "Cantilo N 146 - Planta Alta",
      phone: "221 477 8280",
      description: "Ambientes adicionales para entrevistas, reuniones y terapias.",
    },
  });

  console.log("Creando usuarios y profesionales...");
  
  // 1. Super Admin
  await prisma.authUser.create({
    data: {
      email: "admin@delta.local",
      passwordHash: bcrypt.hashSync("admin1234", 10),
      role: "ADMIN",
    },
  });

  // 2. Recursos reservables: cada registro funciona como una sala/consultorio en la agenda.
  const consultorio1 = await prisma.professional.create({
    data: {
      fullName: "Consultorio 1",
      specialty: "Consultorio equipado",
      bio: "Espacio privado con escritorio, sillon, divan y aire acondicionado frio/calor.",
      email: "consultorio1@delta.local",
      yearsPractice: 1,
      colorToken: "blue",
      consultoryId: sedeCentro.id,
      serves: "Psicologia, entrevistas, terapia individual",
      photoUrl: "https://instagram.fsfn8-1.fna.fbcdn.net/v/t51.82787-15/626555391_17976190391985598_6738617654451879021_n.webp?_nc_cat=105&ig_cache_key=MzgyNTE2MzI5NjgzMTQ1MTQ3Mg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=cADfCm4GYS8Q7kNvwHIpOyx&_nc_oc=AdoHzLx2bytaLgyv3zASF5vUJO2fjEYABv2KLoqZRasdJorjC7AdzNB_pIPCLwAb6tk&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fsfn8-1.fna&_nc_gid=sUcvILmy39s_nDOBIF8dpA&_nc_ss=7a22e&oh=00_Af0HXnZGMojsZ7RqS5WzyAbevSdB12ZtP50S0rHb2fJNQA&oe=69F6A20A",
    },
  });

  const consultorio2 = await prisma.professional.create({
    data: {
      fullName: "Consultorio 2",
      specialty: "Consultorio infantil",
      bio: "Ambiente calido para atencion de ninos, adolescentes y familias.",
      email: "consultorio2@delta.local",
      yearsPractice: 1,
      colorToken: "green",
      consultoryId: sedeCentro.id,
      serves: "Infancias, psicopedagogia, terapias familiares",
      photoUrl: "https://instagram.fsfn8-1.fna.fbcdn.net/v/t51.71878-15/616121767_1593586405129341_1107368176650251365_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=100&ig_cache_key=MzgxMDYwOTcxMzM5NDAyNDM4NA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=zi_Ebu5tFCYQ7kNvwGNldP_&_nc_oc=AdoaFpx8gI3m2BpRj6B0xqVMZgpCgk-2XuB6a7G3v-QAHnXmopvhIpG6p4qW9oFIN4E&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fsfn8-1.fna&_nc_gid=sUcvILmy39s_nDOBIF8dpA&_nc_ss=7a22e&oh=00_Af1D5jK2GOuCcAqOBo6XGmRvL2idwSgT8pBcZmqSYWCJ8A&oe=69F685C0",
    },
  });

  const oficina = await prisma.professional.create({
    data: {
      fullName: "Oficina / Sala de reuniones",
      specialty: "Oficina por modulo",
      bio: "Espacio funcional para reuniones, evaluaciones, entrevistas y trabajo administrativo.",
      email: "oficina@delta.local",
      yearsPractice: 1,
      colorToken: "cyan",
      consultoryId: sedeCityBell.id,
      serves: "Reuniones, admisiones, consultoria profesional",
      photoUrl: "https://instagram.fsfn7-1.fna.fbcdn.net/v/t51.82787-15/613106262_17973674756985598_4946776856791336128_n.webp?_nc_cat=101&ig_cache_key=MzgwODU5MTg4NjQ3ODc2NDM2OA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjExNTJ4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=pnGCthTcbpEQ7kNvwGJCEb_&_nc_oc=AdpUW7QZV6tXxONpNhhWDdJQMuDlN231ft_wLnnIsvKz8Yp5BZKo6c6EM2lMCuK3KBM&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fsfn7-1.fna&_nc_gid=sUcvILmy39s_nDOBIF8dpA&_nc_ss=7a22e&oh=00_Af09EdOT9spNLDiEJAhJb83ijCW0AvJHYbBGEJjg1C_CsQ&oe=69F6B90A",
    },
  });

  const licAgustina = await prisma.professional.create({
    data: {
      fullName: "Lic. Agustina Ferraro",
      specialty: "Psicologia clinica",
      bio: "Atencion psicologica para adolescentes y adultos con agenda propia de turnos.",
      email: "agustina.ferraro@centrovida.ar",
      yearsPractice: 8,
      colorToken: "violet",
      consultoryId: sedeCentro.id,
      serves: "Ansiedad, terapia individual, orientacion familiar",
      photoUrl: "https://ui-avatars.com/api/?name=Agustina+Ferraro&size=160&background=e8e4f8&color=4a4080&bold=true&rounded=true",
    },
  });

  const licTomas = await prisma.professional.create({
    data: {
      fullName: "Lic. Tomas Ibarra",
      specialty: "Kinesiologia",
      bio: "Rehabilitacion, evaluaciones funcionales y seguimiento de tratamientos.",
      email: "tomas.ibarra@puertosalud.ar",
      yearsPractice: 6,
      colorToken: "emerald",
      consultoryId: sedeCityBell.id,
      serves: "Rehabilitacion, postura, dolor cronico",
      photoUrl: "https://ui-avatars.com/api/?name=Tomas+Ibarra&size=160&background=dcfce7&color=166534&bold=true&rounded=true",
    },
  });

  await prisma.authUser.create({
    data: {
      email: "agustina.ferraro@centrovida.ar",
      passwordHash: bcrypt.hashSync("agustina1234", 10),
      role: "PROFESSIONAL",
      professionalId: licAgustina.id,
    },
  });

  await prisma.authUser.create({
    data: {
      email: "tomas.ibarra@puertosalud.ar",
      passwordHash: bcrypt.hashSync("tomas1234", 10),
      role: "PROFESSIONAL",
      professionalId: licTomas.id,
    },
  });

  // 3. Paciente
  await prisma.authUser.create({
    data: {
      email: "cliente@delta.local",
      passwordHash: bcrypt.hashSync("cliente1234", 10),
      role: "PATIENT",
    },
  });

  console.log("Creando horarios...");
  const resources = [consultorio1, consultorio2, oficina, licAgustina, licTomas];
  for (const resource of resources) {
    for (const dayOfWeek of [1, 2, 3, 4, 5]) {
      await prisma.schedule.create({
        data: {
          dayOfWeek,
          startTime: "08:00",
          endTime: "20:00",
          telehealth: false,
          professionalId: resource.id,
        },
      });
    }
    await prisma.schedule.create({
      data: {
        dayOfWeek: 6,
        startTime: "09:00",
        endTime: "13:00",
        telehealth: false,
        professionalId: resource.id,
      },
    });
  }

  const reservationBase = new Date();
  reservationBase.setDate(reservationBase.getDate() + 1);
  reservationBase.setHours(10, 0, 0, 0);

  const demoReservations = [
    {
      patientName: "Lic. Agustina Angulo",
      patientEmail: "agustina@example.com",
      reason: "Reserva modulo semanal para atencion psicologica",
      professionalId: consultorio1.id,
      consultoryId: sedeCentro.id,
      dayOffset: 1,
      hour: 10,
      status: "CONFIRMED" as const,
    },
    {
      patientName: "CENPIA",
      patientEmail: "turnos@cenpia.local",
      reason: "Uso de consultorio infantil para evaluaciones",
      professionalId: consultorio2.id,
      consultoryId: sedeCentro.id,
      dayOffset: 1,
      hour: 15,
      status: "PENDING" as const,
    },
    {
      patientName: "ADN Funcional",
      patientEmail: "adnfuncional@example.com",
      reason: "Entrevistas iniciales y admisiones",
      professionalId: oficina.id,
      consultoryId: sedeCityBell.id,
      dayOffset: 2,
      hour: 9,
      status: "CONFIRMED" as const,
    },
    {
      patientName: "Abaco Inclusion",
      patientEmail: "abaco@example.com",
      reason: "Modulo para reuniones de equipo terapeutico",
      professionalId: oficina.id,
      consultoryId: sedeCityBell.id,
      dayOffset: 3,
      hour: 11,
      status: "PENDING" as const,
    },
    {
      patientName: "Consultorios City Bell",
      patientEmail: "consultorioscb@example.com",
      reason: "Bloque de atencion profesional",
      professionalId: consultorio1.id,
      consultoryId: sedeCentro.id,
      dayOffset: 4,
      hour: 17,
      status: "CONFIRMED" as const,
    },
    {
      patientName: "BE Club Gonnet",
      patientEmail: "beclub@example.com",
      reason: "Reunion de coordinacion mensual",
      professionalId: oficina.id,
      consultoryId: sedeCityBell.id,
      dayOffset: 5,
      hour: 12,
      status: "PENDING" as const,
    },
    {
      patientName: "Marina Lopez",
      patientEmail: "marina.lopez@example.com",
      reason: "Primera entrevista psicologica",
      professionalId: licAgustina.id,
      consultoryId: sedeCentro.id,
      dayOffset: 2,
      hour: 16,
      status: "PENDING" as const,
    },
    {
      patientName: "Sofia Garcia",
      patientEmail: "sofia.garcia@example.com",
      reason: "Sesion de seguimiento",
      professionalId: licAgustina.id,
      consultoryId: sedeCentro.id,
      dayOffset: 4,
      hour: 11,
      status: "CONFIRMED" as const,
    },
    {
      patientName: "Juan Perez",
      patientEmail: "juan.perez@example.com",
      reason: "Evaluacion funcional",
      professionalId: licTomas.id,
      consultoryId: sedeCityBell.id,
      dayOffset: 3,
      hour: 18,
      status: "PENDING" as const,
    },
  ];

  for (const reservation of demoReservations) {
    const startsAt = new Date(reservationBase);
    startsAt.setDate(reservationBase.getDate() + reservation.dayOffset);
    startsAt.setHours(reservation.hour, 0, 0, 0);

    await prisma.appointment.create({
      data: {
        patientName: reservation.patientName,
        patientEmail: reservation.patientEmail,
        reason: reservation.reason,
        startsAt,
        status: reservation.status,
        consultoryId: reservation.consultoryId,
        professionalId: reservation.professionalId,
      },
    });
  }

  console.log("Semilla plantada exitosamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
