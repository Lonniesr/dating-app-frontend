import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface PersonalityStepProps {
  back: () => void;
  next: () => void;
}

const PROMPT_OPTIONS = [
  "My real-life superpower is…",
  "The one thing you should know about me is…",
  "Dating me is like…",
  "The hallmark of a good relationship is…",
  "I’m overly competitive about…",
  "My most irrational fear is…",
  "The quickest way to my heart is…",
  "A perfect Sunday includes…",
];

interface PromptItem {
  question: string;
  answer: string;
}

export default function PersonalityStep({
  back,
  next,
}: PersonalityStepProps) {
  const queryClient = useQueryClient();

  const [prompts, setPrompts] = useState<PromptItem[]>([
    { question: "", answer: "" },
  ]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const updatePrompt = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const updated = [...prompts];
    updated[index][field] = value;
    setPrompts(updated);
  };

  const addPrompt = () => {
    if (prompts.length >= 3) return;
    setPrompts([...prompts, { question: "", answer: "" }]);
  };

  const removePrompt = (index: number) => {
    if (prompts.length === 1) return;
    setPrompts(prompts.filter((_, i) => i !== index));
  };

  const submit = async () => {
    setError(null);

    const cleanedPrompts = prompts
      .map((p) => ({
        question: p.question,
        answer: p.answer.trim(),
      }))
      .filter((p) => p.question && p.answer.length > 0);

    if (cleanedPrompts.length === 0) {
      setError("Please complete at least one personality prompt.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/onboarding/personality`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompts: cleanedPrompts,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to save.");
        setLoading(false);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });

      next();
    } catch (err) {
      console.error("Personality error:", err);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-[#111] p-8 rounded-2xl border border-white/10 shadow-xl">
      <h1 className="text-2xl font-bold mb-2">Personality Prompts</h1>

      <p className="text-white/60 mb-6 text-sm">
        Choose up to 3 prompts and answer them. This helps others get to know you.
      </p>

      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {prompts.map((prompt, i) => {
        const selectedQuestions = prompts.map((p) => p.question);

        return (
          <div
            key={i}
            className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10"
          >
            {/* Prompt Selector */}
            <select
              value={prompt.question}
              onChange={(e) =>
                updatePrompt(i, "question", e.target.value)
              }
              className="w-full p-3 mb-3 rounded-lg bg-white/10 text-white border border-white/20 outline-none"
            >
              <option value="">Select a prompt...</option>
              {PROMPT_OPTIONS.map((option) => (
                <option
                  key={option}
                  value={option}
                  disabled={
                    selectedQuestions.includes(option) &&
                    option !== prompt.question
                  }
                >
                  {option}
                </option>
              ))}
            </select>

            {/* Answer */}
            <textarea
              value={prompt.answer}
              onChange={(e) =>
                updatePrompt(
                  i,
                  "answer",
                  e.target.value.slice(0, 250)
                )
              }
              placeholder="Your answer..."
              rows={3}
              className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 resize-none outline-none"
            />

            <div className="flex justify-between mt-2 text-xs text-white/50">
              <span>{prompt.answer.length}/250</span>

              {prompts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePrompt(i)}
                  className="text-red-400 hover:text-red-500"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        );
      })}

      {prompts.length < 3 && (
        <button
          onClick={addPrompt}
          className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg mb-6"
        >
          Add Another Prompt
        </button>
      )}

      <div className="flex gap-3">
        <button
          onClick={back}
          className="flex-1 py-3 bg-white/10 rounded-lg"
        >
          Back
        </button>

        <button
          onClick={submit}
          disabled={loading}
          className="flex-1 py-3 bg-yellow-500 text-black rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Finish"}
        </button>
      </div>
    </div>
  );
}