import { NextResponse } from "next/server";
import { getSessionPayload } from "@/lib/session";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await getSessionPayload();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No se recibio ningun archivo." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Formato de imagen no permitido. Usa JPG, PNG, WebP o SVG." }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "La imagen no debe superar los 5 MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "professionals");

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    const url = `/uploads/professionals/${filename}`;

    return NextResponse.json({ ok: true, url }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "No se pudo guardar la imagen." }, { status: 500 });
  }
}
