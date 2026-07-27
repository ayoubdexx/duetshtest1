"use client";

import { Printer, X } from "lucide-react";

export function PrintToolbar() {
  return (
    <div className="no-print fixed right-4 top-4 z-50 flex gap-2">
      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
      >
        <Printer className="h-4 w-4" /> Print / Save as PDF
      </button>
      <button
        onClick={() => window.close()}
        className="flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-zinc-600 shadow-lg hover:bg-zinc-50"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
