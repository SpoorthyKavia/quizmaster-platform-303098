// PUBLIC_INTERFACE
export function validateQuestionDraft(draft) {
  /** Validate question draft; returns array of error strings (empty if valid). */
  const errors = [];
  const prompt = (draft.prompt || "").trim();
  if (prompt.length < 5) errors.push("Prompt must be at least 5 characters.");

  const options = Array.isArray(draft.options) ? draft.options : [];
  const trimmed = options.map((o) => (o || "").trim());
  if (trimmed.length !== 4) errors.push("Exactly 4 options are required.");
  if (trimmed.some((o) => o.length < 1)) errors.push("Options cannot be empty.");
  const unique = new Set(trimmed.filter(Boolean));
  if (unique.size !== trimmed.filter(Boolean).length) errors.push("Options must be unique.");

  const correctIndex = Number(draft.correct_index);
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) errors.push("Correct option must be selected.");

  const difficulty = (draft.difficulty || "easy").toLowerCase();
  if (!["easy", "medium", "hard"].includes(difficulty)) errors.push("Difficulty must be easy, medium, or hard.");

  return errors;
}
