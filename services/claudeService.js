const Anthropic = require("@anthropic-ai/sdk");
const { buildPrompt } = require("./promptBuilder");

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

async function askClaude(request) {
    try {
        const prompt = await buildPrompt(request);

        const response = await anthropic.messages.create({
            model: "claude-sonnet-5",
            max_tokens: 2000,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        return response.content
            .filter(item => item.type === "text")
            .map(item => item.text)
            .join("\n");

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