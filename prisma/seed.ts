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
      name: "Sede Centro",
      slug: "sede-centro",
      city: "La Plata",
      address: "Calle 12 N 1234",
      phone: "221-555-1234",
      description: "Consultorios en el corazon de la ciudad.",
    },
  });

  const sedeCityBell = await prisma.consultory.create({
    data: {
      name: "Sede City Bell",
      slug: "sede-city-bell",
      city: "City Bell",
      address: "Camino Belgrano y 473",
      phone: "221-555-4321",
      description: "Nuestra sede norte, amplia y moderna.",
    },
  });

  console.log("Creando usuarios y profesionales...");
  
  // 1. Super Admin
  await prisma.authUser.create({
    data: {
      email: "admin@deltaconsultorios.com.ar",
      passwordHash: bcrypt.hashSync("admin123", 10),
      role: "ADMIN",
    },
  });

  // 2. Profesional
  const prof1 = await prisma.professional.create({
    data: {
      fullName: "Dra. Laura Gonzalez",
      specialty: "Psicologia Clinica",
      bio: "Especialista en ansiedad y depresion con mas de 10 anos de experiencia.",
      email: "laura.gonzalez@example.com",
      yearsPractice: 10,
      colorToken: "blue",
      consultoryId: sedeCentro.id,
      serves: "Adultos y adolescentes",
    },
  });

  await prisma.authUser.create({
    data: {
      email: "profesional@deltaconsultorios.com.ar",
      passwordHash: bcrypt.hashSync("prof123", 10),
      role: "PROFESSIONAL",
      professionalId: prof1.id,
    },
  });

  // 3. Paciente
  await prisma.authUser.create({
    data: {
      email: "paciente@example.com",
      passwordHash: bcrypt.hashSync("paciente123", 10),
      role: "PATIENT",
    },
  });

  console.log("Creando horarios...");
  await prisma.schedule.create({
    data: {
      dayOfWeek: 1, // Lunes
      startTime: "09:00",
      endTime: "13:00",
      telehealth: false,
      professionalId: prof1.id,
    },
  });

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
