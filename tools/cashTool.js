const erpRepository = require('../repositories/erpRepository');

async function execute(session) {

    const data = await erpRepository.getERPContext(session);

    return {

        tool: "Cash Position",

        result: data.summary

    };

}

module.exports = {
    execute
};