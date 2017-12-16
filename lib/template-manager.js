let { URL } = require("url");

let ConfigManager = require("./config-manager"),
    VersionManager = require("./version-manager"),
    Template = require("./template");

let TemplateManager = {
    async download(options) {
        if (!ConfigManager.haveServerUrl()) {
            console.log("template-cli: server is need！");
            return;
        }
        let templateData = await VersionManager.getTemplateData(options.templateName, options.version);

        if (!templateData) {
            console.log(`template-cli: ${options.templateName} not found`);
            return;
        }
        
        templateData.downloadUrl = this._buildTempateDownLoadUrl(templateData.path);
        Template.run(templateData);
    },

    _buildTempateDownLoadUrl(path) {
        let server = ConfigManager.getServerUrl();

        return new URL(path, server);
    }
};

module.exports = TemplateManager;