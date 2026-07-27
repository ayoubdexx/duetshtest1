import type { Metadata } from "next";
import { PrintToolbar } from "@/components/print/print-shell";

export const metadata: Metadata = {
  title: { default: "Print · Deutschwerk", template: "%s · Deutschwerk PDF" },
  robots: { index: false },
};

export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-100 print:bg-white">
      <PrintToolbar />
      <div className="mx-auto min-h-screen max-w-[820px] bg-white px-10 py-10 text-zinc-900 shadow-xl sm:px-14 print:max-w-none print:px-0 print:py-0 print:shadow-none">
        {children}
      </div>
    </div>
  );
}
