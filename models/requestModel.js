class RequestModel {
    constructor(body = {}) {
        this.question = body.question || "";

        const sessionData = body.session || body.user || {};

        this.session = {
            userName: sessionData.userName || "",
            organizationId: sessionData.organizationId || null,
            organizationName: sessionData.organizationName || "",
            branchId: sessionData.branchId || null,
            branchName: sessionData.branchName || "",
            module: sessionData.module || "",
            screen: sessionData.screen || "",
            language: sessionData.language || "en"
        };

        this.context = body.context || {};

        this.conversationHistory = Array.isArray(body.conversationHistory)
            ? body.conversationHistory
                .filter(message =>
                    message &&
                    (message.role === "user" || message.role === "assistant") &&
                    typeof message.content === "string" &&
                    message.content.trim()
                )
                .slice(-10)
                .map(message => ({
                    role: message.role,
                    content: message.content.trim()
                }))
            : [];
    }
}

module.exports = RequestModel;