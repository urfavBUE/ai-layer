const Anthropic = require("@anthropic-ai/sdk");
const { buildPrompt } = require("./promptBuilder");

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

function extractJSON(text) {
    const cleaned = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1) {
        throw new Error("Claude did not return valid JSON");
    }

    return JSON.parse(cleaned.slice(start, end + 1));
}

async function askClaude(request) {
    try {
        const prompt = await buildPrompt(request);

        const response = await anthropic.messages.create({
            model: "claude-sonnet-5",
            max_tokens: 1200,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        const rawText = response.content
            .filter(item => item.type === "text")
            .map(item => item.text)
            .join("\n");

        const parsed = extractJSON(rawText);

        return {
            answer: parsed.answer || "No answer was generated.",
            evidence: Array.isArray(parsed.evidence)
                ? parsed.evidence.slice(0, 4)
                : [],
            risks: Array.isArray(parsed.risks)
                ? parsed.risks.slice(0, 3)
                : [],
            recommendations: Array.isArray(parsed.recommendations)
                ? parsed.recommendations.slice(0, 4)
                : [],
            followUpSuggestions: Array.isArray(parsed.followUpSuggestions)
                ? parsed.followUpSuggestions.slice(0, 3)
                : [],
            navigationTargets: Array.isArray(parsed.navigationTargets)
                ? parsed.navigationTargets.slice(0, 3)
                : []
        };

    } catch (error) {
        console.error("Claude API Error:", error);

        throw new Error(
            error?.error?.error?.message ||
            error?.message ||
            "Claude API request failed"
        );
    }
}

module.exports = {
    askClaude
};