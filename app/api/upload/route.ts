import { NextResponse } from "next/server";
import { getSessionPayload } from "@/lib/session";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 1_500_000;

export async function POST(request: Request) {
  const session = await getSessionPayload();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No se recibió ningún archivo." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Formato no permitido. Usá JPG, PNG o WebP." }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "La imagen procesada no debe superar 1,5 MB." }, { status: 400 });
    }

    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
    const url = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ ok: true, url }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "No se pudo guardar la imagen." }, { status: 500 });
  }
}
