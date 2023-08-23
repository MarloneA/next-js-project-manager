import { formatTodosForAI } from "./formatTodosForAI";

export const fetchSuggestion = async (board: Board) => {
  const todos = formatTodosForAI(board);

  const response = await fetch("/api/generateSummary", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ todos })
  });

  const GPTData = await response.json();

  const { suggestion } = GPTData;

  return suggestion;
}