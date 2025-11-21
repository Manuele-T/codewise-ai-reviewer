import { AnalysisResponse } from "../types";

export const analyzeCode = async (codeSnippet: string): Promise<AnalysisResponse> => {
  try {
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