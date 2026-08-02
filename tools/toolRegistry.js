const cashTool = require('./cashTool');

const tools = {

    CASH: cashTool

};

function getTool(toolName) {

    return tools[toolName];

}

module.exports = {
    getTool
};