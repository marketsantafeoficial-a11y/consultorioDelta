import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionPayload } from "@/lib/session";
import { z } from "zod";

const updateSchema = z.object({
  fullName: z.string().trim().min(2),
  specialty: z.string().trim().min(2),
  bio: z.string().trim().min(8).optional(),
  serves: z.string().trim().optional().or(z.literal("")),
  photoUrl: z.string().trim().optional().or(z.literal("")),
  whatsapp: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email().optional().or(z.literal("")),
  consultoryId: z.number().int().positive().optional(),
});

async function requireAdmin() {
  const session = await getSessionPayload();
  return Boolean(session && session.role === "ADMIN");
}

function parseId(idParam: string) {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id: idParam } = await params;
  const id = parseId(idParam);

  if (!id) {
    return NextResponse.json({ error: "Id invalido." }, { status: 400 });
  }

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Revisa los datos del profesional." }, { status: 400 });
  }

  const existing = await prisma.professional.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Profesional no encontrado." }, { status: 404 });
  }

  try {
    const professional = await prisma.professional.update({
      where: { id },
      data: {
        fullName: parsed.data.fullName,
        specialty: parsed.data.specialty,
        bio: parsed.data.bio ?? existing.bio,
        serves: parsed.data.serves || null,
        photoUrl: parsed.data.photoUrl || null,
        whatsapp: parsed.data.whatsapp || null,
        email: parsed.data.email || existing.email,
        consultoryId: parsed.data.consultoryId ?? existing.consultoryId,
      },
      include: { consultory: true },
    });

    return NextResponse.json({ ok: true, professional });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json({ error: "Ya existe un profesional con ese email." }, { status: 409 });
    }

    return NextResponse.json({ error: "No se pudo actualizar el profesional." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id: idParam } = await params;
  const id = parseId(idParam);

  if (!id) {
    return NextResponse.json({ error: "Id invalido." }, { status: 400 });
  }

  const existing = await prisma.professional.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Profesional no encontrado." }, { status: 404 });
  }

  await prisma.professional.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
