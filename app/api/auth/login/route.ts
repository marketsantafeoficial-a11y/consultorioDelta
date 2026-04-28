import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signSession, verifyPassword } from "@/lib/auth";
import { setSessionCookie } from "@/lib/session";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Credenciales invalidas." }, { status: 400 });
    }

    const user = await prisma.authUser.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
      select: {
        id: true,
        email: true,
        role: true,
        passwordHash: true,
        isActive: true,
        professionalId: true,
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 401 });
    }

    const valid = await verifyPassword(parsed.data.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Contrasena incorrecta." }, { status: 401 });
    }

    const token = await signSession({
      userId: user.id,
      role: user.role,
      professionalId: user.professionalId ?? undefined,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      ok: true,
      role: user.role,
      redirectTo: user.role === "ADMIN" ? "/dashboard" : user.role === "PROFESSIONAL" ? "/professional" : "/calendario",
    });
  } catch {
    return NextResponse.json({ error: "No se pudo iniciar sesion." }, { status: 500 });
  }
}
