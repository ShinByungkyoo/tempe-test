"use client";

import { useEffect, useState } from "react";
import Intro from "@/components/Intro";
import Survey from "@/components/Survey";
import Result from "@/components/Result";
import type { Answers } from "@/lib/scoring";

type Stage = "intro" | "survey" | "result";

const STORAGE_KEY = "self-diagnosis-answers-v1";

export default function Home() {
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<Answers>({});
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHasSaved(true);
    } catch {}
  }, []);

  const handleStart = (resume: boolean) => {
    if (resume) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setAnswers(JSON.parse(raw));
      } catch {}
    } else {
      setAnswers({});
    }
    setStage("survey");
  };

  const handleSubmit = (final: Answers) => {
    setAnswers(final);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(final));
    } catch {}
    setStage("result");
  };

  const handleRestart = () => {
    setAnswers({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setStage("intro");
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      {stage === "intro" && <Intro onStart={handleStart} hasSaved={hasSaved} />}
      {stage === "survey" && (
        <Survey initialAnswers={answers} onSubmit={handleSubmit} />
      )}
      {stage === "result" && (
        <Result answers={answers} onRestart={handleRestart} />
      )}
    </main>
  );
}
