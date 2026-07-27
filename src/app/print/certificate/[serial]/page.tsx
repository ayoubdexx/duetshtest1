import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LEVEL_META, type LevelCode } from "@/lib/levels";

export const metadata = { title: "Certificate" };

export default async function PrintCertificatePage({ params }: { params: Promise<{ serial: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { serial } = await params;
  const cert = await prisma.certificate.findUnique({
    where: { serial: decodeURIComponent(serial) },
    include: { user: { select: { id: true, name: true } } },
  });
  if (!cert) notFound();
  if (cert.user.id !== session.user.id && session.user.role !== "ADMIN") notFound();

  const meta = LEVEL_META[(cert.levelCode as LevelCode) in LEVEL_META ? (cert.levelCode as LevelCode) : "A1"];

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-8">
      <div className="avoid-break w-full rounded-none border-[6px] border-double border-zinc-900 p-10 text-center sm:p-14">
        <div className="text-xl font-bold tracking-tight">
          Deutsch<span className="text-amber-600">werk</span>
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-zinc-500">Zertifikat · Certificate of Achievement</div>

        <div className="mx-auto mt-8 h-px w-24 bg-zinc-300" />

        <p className="mt-8 text-sm text-zinc-600">Hiermit wird bestätigt, dass · This certifies that</p>
        <div className="mt-3 font-serif text-4xl font-bold tracking-tight">{cert.user.name}</div>

        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-zinc-600">
          das Niveau <strong className="text-zinc-900">{cert.levelCode} — {meta.title}</strong> des Gemeinsamen
          Europäischen Referenzrahmens (GER/CEFR) erfolgreich abgeschlossen hat — mit einem Ergebnis von{" "}
          <strong className="text-zinc-900">{Math.round(cert.score)}%</strong> in der Abschlussprüfung.
        </p>

        <div className="mx-auto mt-10 flex max-w-sm items-end justify-between text-xs text-zinc-500">
          <div className="text-left">
            <div className="mb-1 border-b border-zinc-400 pb-1 font-serif text-base italic text-zinc-800">Deutschwerk</div>
            Die Lernplattform
          </div>
          <div className="text-right">
            <div className="mb-1 border-b border-zinc-400 pb-1 text-base text-zinc-800">
              {cert.issuedAt.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}
            </div>
            Datum
          </div>
        </div>

        <div className="mt-8 font-mono text-[10px] tracking-widest text-zinc-400">Serial: {cert.serial}</div>
        <p className="mt-2 text-[9px] text-zinc-400">
          Internal learning milestone of the Deutschwerk platform — not an official Goethe-Institut or telc certificate.
        </p>
      </div>
    </div>
  );
}
