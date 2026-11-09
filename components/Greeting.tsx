"use client";

import { useEffect, useState } from "react";
import type { Dict } from "@/lib/content";

// Saludo según la hora del visitante (se muestra al cargar para evitar desajustes).
export default function Greeting({ g }: { g: Dict["greet"] }) {
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    const h = new Date().getHours();
    setText(h < 12 ? g.morning : h < 19 ? g.afternoon : g.evening);
  }, [g]);
  return <p className="greet" aria-live="off">{text ?? " "}</p>;
}
