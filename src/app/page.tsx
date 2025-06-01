import Link from "next/link";
import { Button } from "~/components/ui/button";
import { H1 } from "~/components/ui/h1";

export default function Home() {
  return (
    <main className="container mx-auto flex flex-col items-center justify-center gap-4 p-4">
      <H1>MediaNerdle</H1>
      <p>Cine2Nerdle Battle clone with movies and tv shows</p>
      <Button size="lg" asChild>
        <Link href="/battle">Play Now</Link>
      </Button>
    </main>
  );
}
