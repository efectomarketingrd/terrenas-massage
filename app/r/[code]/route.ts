import { NextResponse, type NextRequest } from "next/server";
import { readReserva } from "@/lib/reserva";
import { payPath } from "@/lib/payments";

// Enlace corto de la reserva → página "Paga tu masaje" en el idioma de la reserva
export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const r = readReserva(code);
  return NextResponse.redirect(new URL(payPath(r?.l ?? "es", r ? code : ""), req.url), 307);
}
