class RequestModel {

    constructor(body = {}) {

        this.question = body.question || "";

        // يقبل البيانات سواء جاية باسم user أو session
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
    }

}

module.exports = RequestModel;