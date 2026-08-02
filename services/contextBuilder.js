const erpRepository = require('../repositories/erpRepository');

async function buildContext(request) {
    const repositoryContext = await erpRepository.getERPContext(request.session);

    const liveContext = request.context || {};

    return {
        organization: repositoryContext.organization,
        branch: repositoryContext.branch,
        module: repositoryContext.module,
        screen: repositoryContext.screen,
        language: repositoryContext.language,
        user: repositoryContext.user,

        // بيانات الموقع الحقيقية
        ...liveContext,

        // الاحتفاظ بالملخص القديم لو موجود
        summary: {
            ...(repositoryContext.summary || {}),
            ...(liveContext.summary || {})
        }
    };
}

module.exports = {
    buildContext
};