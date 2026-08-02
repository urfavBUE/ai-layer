class RequestModel {

    constructor(body) {

        this.question = body.question || "";

        this.session = body.session || {};

        this.context = body.context || {};

    }

}

module.exports = RequestModel;