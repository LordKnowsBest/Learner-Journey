"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, HelpCircle } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 overflow-hidden bg-background">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 md:w-[500px] md:h-[500px] translate-x-1/3 -translate-y-1/3 text-accent opacity-20 md:opacity-100 pointer-events-none">
          {/* Starburst SVG */}
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-current animate-spin-slow">
            <path d="M100 0 L112 88 L200 100 L112 112 L100 200 L88 112 L0 100 L88 88 Z" />
            {/* Add more rays for a true burst effect if needed, or stick to a simple star */}
            <path d="M100 0 L122 78 L200 100 L122 122 L100 200 L78 122 L0 100 L78 78 Z" transform="rotate(22.5 100 100)" />
          </svg>
        </div>

        <div className="absolute bottom-0 left-0 w-48 h-48 md:w-96 md:h-96 -translate-x-1/4 translate-y-1/4 text-secondary opacity-20 md:opacity-100 pointer-events-none">
          {/* Cross/Plus Shape */}
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-current">
            <rect x="60" y="0" width="80" height="200" />
            <rect x="0" y="60" width="200" height="80" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-start gap-6">
          <div className="max-w-3xl">
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-primary mb-4 drop-shadow-sm">
              KAITE
            </h1>
            <p className="text-xl md:text-2xl font-bold text-primary/80 mb-8 max-w-xl">
              Knowledge-graph Assisted Instructional Tutoring Environment
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="bg-black text-white px-2 py-1 font-mono text-sm uppercase">Team D</div>
              <div className="bg-black text-white px-2 py-1 font-mono text-sm uppercase">Fall 2025 | Purdue MSAI Capstone</div>
            </div>

            <div className="mt-12">
              <Button asChild size="lg" className="text-xl px-8 py-6 h-auto">
                <Link href="/problems">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* The Education Crisis Section */}
      <section className="w-full py-20 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Decorative elements for this section can be added here */}

        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-16">
            <h2 className="text-5xl md:text-7xl font-black leading-none mb-2">
              The Education <span className="text-accent">Crisis</span>
            </h2>
            <h2 className="text-5xl md:text-7xl font-black leading-none text-secondary">
              We're Solving
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            {/* Student Reality */}
            <div className="space-y-6">
              <div className="inline-block bg-secondary text-secondary-foreground px-4 py-2 transform -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-xl font-bold uppercase">Student Reality</h3>
              </div>
              <blockquote className="text-lg md:text-xl font-medium leading-relaxed border-l-4 border-secondary pl-6">
                “Lessons feel generic. No one checks if I've really mastered what I need to know.”
              </blockquote>

              <div className="inline-block bg-secondary text-secondary-foreground px-4 py-2 transform rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-4">
                <h3 className="text-xl font-bold uppercase">Systemic Gap</h3>
              </div>
              <p className="text-lg opacity-90">
                AI literacy matters most when curiosity becomes career direction — yet ethical, scalable, and personalized tools for this stage are missing.
              </p>
            </div>

            {/* Educator Challenge */}
            <div className="space-y-6">
              <div className="inline-block bg-accent text-accent-foreground px-4 py-2 transform rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-xl font-bold uppercase">Educator Challenge</h3>
              </div>
              <ul className="space-y-4 text-lg md:text-xl">
                <li className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 bg-white rounded-full mt-2.5 flex-shrink-0" />
                  <span>73% of middle school teachers lack AI literacy resources.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 bg-white rounded-full mt-2.5 flex-shrink-0" />
                  <span>Most tools are scattered, overly technical, or not adaptive.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 bg-white rounded-full mt-2.5 flex-shrink-0" />
                  <span>Few align with CTE competency frameworks (ISTE / ACTE).</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer info from slide */}
        <div className="container mx-auto px-4 mt-20 pt-10 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between gap-8 text-sm md:text-base opacity-80">
          <div>
            <div className="bg-black text-white px-2 py-1 inline-block mb-2 font-bold text-xs uppercase">Presented by:</div>
            <p>Ajay Gopalakrishnan | Evelyn Hawkins | Jagruti Mule | Levy Rivers</p>
          </div>

          <div className="md:text-right">
            <div className="bg-black text-white px-2 py-1 inline-block mb-2 font-bold text-xs uppercase">Faculty Mentor</div>
            <p>Dr. Wanju Huang</p>
            <p>Stephen Leitch</p>
          </div>
        </div>
      </section>
    </div>
  );
}
