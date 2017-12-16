let ConfigManager = require("./config-manager"),
    TemplateManager = require("./template-manager");

let TemplateCli = {
    download(options) {
        if (options.server) {
            ConfigManager.updateServer(options.server);
        }

        if (options.template) {
            TemplateManager.download({
                templateName: options.template,
                version: options.version
            });
        }
    }
 };

module.exports = TemplateCli;