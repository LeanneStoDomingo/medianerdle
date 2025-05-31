import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <main className="container mx-auto flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        MediaNerdle
      </h1>
      <p>Cine2Nerdle Battle clone with movies and tv shows</p>
      <Button size="lg" asChild>
        <Link href="/battle">Play Now</Link>
      </Button>
    </main>
  );
}
