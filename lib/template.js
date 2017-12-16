let config = require("./config"),
    errorFactory = require("./error-factory"),
    templateManager = require("./template-manager")
    axios = require("axios");

let template = {
    async download(templateName, version) {
        let templateConfig = await config.getConfig();

        if (!templateConfig.remoteUrl) {
            errorFactory.throwsError("remote-url is need");
        }

        let packageJson = await this._getPackageJson(),
            info = await this._buildDownPackageInfo(templateName, version, packageJson),
            isTemplateExists = await templateManager.isTemplateExists(info);
        
        if (!isTemplateExists) {
            await templateManager.downloadTemplate(info);         
        }

        await templateManager.extractTemplateTo(info, process.cwd());
    },

    async _getPackageJson() {
        let url = await config.getPackageUrl();

        return axios.get(url).then((response) => response.data);
    },

    async _buildDownPackageInfo(templateName, version, packageJson) {
        let info = {},
            packageSection = packageJson.template[templateName],
            packageItem = null;
            
        if (!version) {
            version = packageSection.default;
        }
        packageItem = packageSection[version];

        info.downloadUrl = await config.buildTemplateDownLoadUrl(packageItem.path);
        info.version = version;
        info.templateName = templateName;
        info.name = packageItem.name;

        return info;
    }
};

module.exports = template;