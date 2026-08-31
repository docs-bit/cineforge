import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gold font-heading text-2xl font-bold text-black">
          CF
        </div>
        <div>
          <h1 className="heading-display text-3xl text-foreground">
            CineForge AI
          </h1>
          <p className="mt-2 text-muted-foreground">
            Hollywood-Style AI Movie Editor
          </p>
        </div>
        <Link
          href="/studio/cinema"
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gold-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Open Cinema Studio →
        </Link>
      </div>
    </div>
  );
}
