import { BrainCircuit } from "lucide-react";
import Link from "next/link";

export function AppHeader() {
  return (
    <header className="bg-primary/90 text-primary-foreground backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="h-7 w-7" />
          <h1 className="text-2xl font-bold font-headline">
            KAITE: AI Ethics Tutor
          </h1>
        </Link>
      </div>
    </header>
  );
}
