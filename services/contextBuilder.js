const erpRepository = require('../repositories/erpRepository');

async function buildContext(request) {

    const erpContext = await erpRepository.getERPContext(request.session);

    return {

        organization: erpContext.organization,
        branch: erpContext.branch,
        module: erpContext.module,
        screen: erpContext.screen,
        language: erpContext.language,
        user: erpContext.user,

        summary: erpContext.summary

    };

}

module.exports = {
    buildContext
};