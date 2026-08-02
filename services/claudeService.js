const Anthropic = require("@anthropic-ai/sdk");
const { buildPrompt } = require("./promptBuilder");

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

async function askClaude(request) {

    try {

        const prompt = await buildPrompt(request);

        const response = await anthropic.messages.create({

            model: "claude-3-5-sonnet-latest",

            max_tokens: 1000,

            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]

        });

        return response.content
            .filter(x => x.type === "text")
            .map(x => x.text)
            .join("\n");

    } catch (err) {

        console.log("FULL ERROR:");
        console.log(err);

        throw err;

    }

}

module.exports = {
    askClaude
};