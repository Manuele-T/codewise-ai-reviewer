import dotenv from 'dotenv';
import path from 'path';

// FORCE LOAD: Explicitly point to .env.local in the project root
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

export default async function handler(req, res) {
  // 1. Debug Logs (Only visible in Local Development)
  if (process.env.NODE_ENV !== 'production') {
    console.log("---------------------------------------------------");
    console.log("1. API Route Hit");
    console.log("2. Key Status:", process.env.OPENAI_API_KEY ? "FOUND ✅" : "MISSING ❌");
    console.log("---------------------------------------------------");
  }

  // 2. Method Check
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server config error: API Key missing" });
  }

  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  // 3. Validation: Enforce 60k Character Limit
  if (code.length > 60000) {
    return res.status(400).json({ 
      error: `Code is too long (${code.length} chars). Max limit is 60,000 characters.` 
    });
  }

  // 4. System Prompt (Strict JSON Schema)
  const systemPrompt = `
    You are CodeWise, an expert Senior Software Engineer.
    You MUST output a valid, raw JSON object strictly following this schema:
    {
      "summary": "A concise paragraph summarizing quality and purpose.",
      "strengths": ["List of specific clean code practices found"],
      "weaknesses": ["List of specific issues, bugs, or bad practices"],
      "improvements": ["Actionable steps to improve the code"],
      "securityIssues": ["Specific security vulnerabilities (SQLi, XSS, etc)"],
      "refactoredCode": "An improved version of the code. If code is too long, provide the most critical snippet."
    }
    Focus on: 1. Readability 2. Performance 3. Security 4. Best Practices.
  `;

  try {
    // 5. Call OpenAI API (gpt-4o-mini)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", 
        messages: [
          { role: "system", content: systemPrompt },
          // "Sanitization": Wrap user code in tags so the AI knows it's data, not instructions
          { role: "user", content: `Analyze the following code snippet:\n\n<code_snippet>\n${code}\n</code_snippet>` }
        ],
        response_format: { type: "json_object" }, 
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "OpenAI API Error");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return res.status(200).json(JSON.parse(content));

  } catch (error) {
    console.error("Analysis Error:", error);
    return res.status(500).json({ error: "Analysis failed. " + error.message });
  }
}