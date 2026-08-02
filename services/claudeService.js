const Anthropic = require('@anthropic-ai/sdk');
const { buildPrompt } = require('./promptBuilder');

const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY
});

async function askClaude(request) {

    const prompt = await buildPrompt(request);

    const response = await anthropic.messages.create({

        model: "claude-sonnet-5",

        max_tokens: 1000,

        messages: [
            {
                role: "user",
                content: prompt
            }
        ]

    });

    const answer = response.content
        .filter(item => item.type === "text")
        .map(item => item.text)
        .join("\n");

    return answer;
}

module.exports = {
    askClaude
};