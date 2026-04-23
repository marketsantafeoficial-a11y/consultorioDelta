import { NextResponse } from "next/server";
import { getAvailabilityByDate } from "@/lib/appointments";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const professionalId = Number(searchParams.get("professionalId"));
  const dateRaw = searchParams.get("date");

  if (!professionalId || !dateRaw) {
    return NextResponse.json({ error: "Faltan parametros." }, { status: 400 });
  }

  const date = new Date(dateRaw);
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "Fecha invalida." }, { status: 400 });
  }

  const slots = await getAvailabilityByDate(professionalId, date);

  return NextResponse.json({ slots: slots.map((slot) => slot.toISOString()) });
}
