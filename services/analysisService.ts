import { AnalysisResponse } from "../App";

export const analyzeCode = async (codeSnippet: string): Promise<AnalysisResponse> => {
  try {
    // Call our own secure backend (no API key needed here)
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: codeSnippet }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Analysis request failed");
    }

    return await response.json();

  } catch (error: any) {
    console.error("Analysis Service Error:", error);
    throw new Error(error.message || "Failed to connect to analysis service.");
  }
};