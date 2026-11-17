"use client";

import { useState } from "react";

export default function CopyBtn({ text, label, done }: { text: string; label: string; done: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className={`copy ${ok ? "is-ok" : ""}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setOk(true);
          setTimeout(() => setOk(false), 1800);
        } catch {}
      }}
    >
      {ok ? done : label}
    </button>
  );
}
