import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionPayload } from "@/lib/session";
import { z } from "zod";

const professionalSchema = z.object({
  fullName: z.string().trim().min(2),
  specialty: z.string().trim().min(2),
  bio: z.string().trim().min(8),
  serves: z.string().trim().optional(),
  photoUrl: z.string().trim().url().optional().or(z.literal("")),
  email: z.string().trim().email().optional().or(z.literal("")),
  consultoryId: z.number().int().positive(),
});

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/(^\.|\.$)/g, "");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const specialty = searchParams.get("specialty");

  const professionals = await prisma.professional.findMany({
    where: specialty ? { specialty: { contains: specialty } } : undefined,
    include: {
      consultory: true,
      schedules: {
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      },
    },
    orderBy: { fullName: "asc" },
  });

  return NextResponse.json({ professionals });
}

export async function POST(request: Request) {
  const session = await getSessionPayload();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = professionalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Revisa los datos del profesional." }, { status: 400 });
    }

    const consultory = await prisma.consultory.findUnique({
      where: { id: parsed.data.consultoryId },
    });

    if (!consultory) {
      return NextResponse.json({ error: "La sede seleccionada no existe." }, { status: 400 });
    }

    const generatedEmail = `${slugify(parsed.data.fullName)}.${Date.now()}@delta-prof.local`;
    const email = parsed.data.email?.trim().toLowerCase() || generatedEmail;

    const professional = await prisma.professional.create({
      data: {
        fullName: parsed.data.fullName,
        specialty: parsed.data.specialty,
        bio: parsed.data.bio,
        serves: parsed.data.serves || null,
        photoUrl: parsed.data.photoUrl || null,
        email,
        yearsPractice: 1,
        colorToken: "team",
        consultoryId: parsed.data.consultoryId,
      },
      include: {
        consultory: true,
      },
    });

    return NextResponse.json({ ok: true, professional }, { status: 201 });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json({ error: "Ya existe un profesional con ese email." }, { status: 409 });
    }

    return NextResponse.json({ error: "No se pudo cargar el profesional." }, { status: 500 });
  }
}
