let ConfigManager = require("./config-manager"),
    TemplateManager = require("./template-manager"),
    VersionManager = require("./version-manager");

let TemplateCli = {
    download(options) {
        if (options.server) {
            ConfigManager.updateServer(options.server);
            return;
        }

        if (options.list === true) {
            VersionManager.showVersionInfo();
            return;
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