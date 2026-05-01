import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionPayload } from "@/lib/session";

const moduleSchema = z.object({
  id: z.number().int().positive().optional(),
  fullName: z.string().trim().min(2),
  specialty: z.string().trim().min(2),
  bio: z.string().trim().min(4),
  serves: z.string().trim().optional(),
  photoUrl: z.string().trim().url().optional().or(z.literal("")),
  consultoryId: z.number().int().positive(),
});

function moduleEmailFromName(name: string, id?: number) {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/(^\.|\.$)/g, "");

  return `${slug || "modulo"}${id ? `.${id}` : `.${Date.now()}`}@delta-module.local`;
}

async function requireAdmin() {
  const session = await getSessionPayload();

  if (!session || session.role !== "ADMIN") {
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = moduleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Revisa los datos del modulo." }, { status: 400 });
  }

  const consultory = await prisma.consultory.findUnique({
    where: { id: parsed.data.consultoryId },
  });

  if (!consultory) {
    return NextResponse.json({ error: "La sede no existe." }, { status: 400 });
  }

  const data = {
    fullName: parsed.data.fullName,
    specialty: parsed.data.specialty,
    bio: parsed.data.bio,
    serves: parsed.data.serves || null,
    photoUrl: parsed.data.photoUrl || null,
    yearsPractice: 1,
    colorToken: "module",
    consultoryId: parsed.data.consultoryId,
  };

  const room = parsed.data.id
    ? await prisma.professional.update({
        where: { id: parsed.data.id },
        data,
      })
    : await prisma.professional.create({
        data: {
          ...data,
          email: moduleEmailFromName(parsed.data.fullName),
        },
      });

  return NextResponse.json({ ok: true, module: room });
}
