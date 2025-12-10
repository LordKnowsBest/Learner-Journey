"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { CheckpointAssessment } from "@/components/checkpoint-assessment";
import { getCheckpointById } from "@/lib/checkpoint-config";
import { CheckpointConfig, MasteryEvidence } from "@/lib/types";
import { useSession } from "@/context/SessionContext";
import { Loader2 } from "lucide-react";

interface CheckpointPageProps {
  params: Promise<{ checkpointId: string }>;
}

export default function CheckpointPage({ params }: CheckpointPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { assessmentState, updateMasteryFromAssessment } = useSession();
  const [checkpoint, setCheckpoint] = useState<CheckpointConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cp = getCheckpointById(resolvedParams.checkpointId);
    if (cp) {
      // Check if already completed
      if (assessmentState?.checkpointsCompleted.includes(cp.checkpointId)) {
        setError("You have already completed this checkpoint.");
      } else {
        setCheckpoint(cp);
      }
    } else {
      setError("Checkpoint not found.");
    }
    setLoading(false);
  }, [resolvedParams.checkpointId, assessmentState?.checkpointsCompleted]);

  const handleComplete = (passed: boolean, score: number, evidence: MasteryEvidence[]) => {
    // Navigate based on result
    if (passed) {
      // Redirect to success page or continue learning
      router.push("/problems?checkpoint=passed");
    } else {
      // Redirect to review materials
      router.push("/problems?checkpoint=retry");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading checkpoint...</p>
      </div>
    );
  }

  if (error || !checkpoint) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Checkpoint Unavailable</h1>
          <p className="text-muted-foreground mb-4">{error || "This checkpoint does not exist."}</p>
          <button
            onClick={() => router.push("/problems")}
            className="text-primary hover:underline"
          >
            Return to Problems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <CheckpointAssessment
        checkpoint={checkpoint}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </div>
  );
}
