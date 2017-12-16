let config = require("./config"),
    template = require("./template");

let templateCli = {
    start: function (options) {
        if (options.config) {
            config.setConfig(options.config);
        }

        if (options.template) {
            template.download(options.template, options.version);
        }
    }
};

module.exports = templateCli;