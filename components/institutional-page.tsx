import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type InstitutionalPageProps = {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
};

export function InstitutionalPage({
  title,
  eyebrow,
  children
}: InstitutionalPageProps) {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-primary text-white">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <Link className="text-2xl font-black" href="/">
            Bookenya
          </Link>
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "bg-white text-primary hover:bg-white/90"
            )}
            href="/contact"
          >
            Contact support
          </Link>
        </nav>
        <section className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-white/70">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            {title}
          </h1>
        </section>
      </header>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Card>
          <CardContent className="space-y-4 p-6 leading-7 text-slate-700">
            {children}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
