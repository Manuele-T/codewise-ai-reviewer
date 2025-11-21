export interface AnalysisResponse {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  securityIssues: string[];
  refactoredCode?: string;
}