let nodeHttp = require("http"),
    nodeOs = require("os"),
    nodePath = require("path"),
    nodeFs = require("fs"),
    { URL } = require("url"),
    mkdirp = require("mkdirp");

let ConfigManager = require("./config-manager"),
    Config = require("./config"),
    Tool = require("./tools"),
    HttpServer = require("./http-server"),
    MsgService = require("./msg-service");

let VersionManager = {
    _versionData: null,

    async getTemplateData(templateName, version) {
        
        let result = null;

        if (this._versionData === null) {            
            this._versionData = await this._loadVersionData();
        }

        let packageSection = this._versionData.template[templateName];

        if (packageSection) {
            if (!version) {
                version = packageSection.default;
            }
            let templateData = packageSection[version];

            if (templateData) {
                result = {
                    version,
                    templateName,
                    options: templateData.options,
                    name: templateData.name,
                    path: templateData.path
                }
            }

        }
        return result; 
    },

    async showVersionInfo() {
        let data = await this._loadVersionData(),
            templateData = data.template,
            infoList = [];

        for(let templateName in templateData) {
            if (templateData.hasOwnProperty(templateName)) {
                let templateItem = templateData[templateName];

                for(let version in templateItem) {
                    if (templateItem.hasOwnProperty(version) && version !== "default") {
                        let description = templateItem[version].description;
                        MsgService.showInfo(`${templateName}@${version}`, description ? description : "");
                    }
                }
            }
        }
    },

    async _loadVersionData() {
        let savePath = this._buildLocalFolderPath();
        await Tool.ensureFolderExist(savePath);

        let packageUrl = this._buildPackageFileUrl(),
            localFilePath = this._buildPackageFileLocalPath();

        await HttpServer.downloadFile(packageUrl, localFilePath);

        let data = nodeFs.readFileSync(localFilePath, "utf-8");
        return JSON.parse(data);
    },

    _buildPackageFileUrl() {
        let server = ConfigManager.getServerUrl();

        return new URL(Config.REMOTE_PACKAGE_NAME, server);
    },

    _buildLocalFolderPath() {
        return nodePath.join(nodeOs.homedir(), Config.CACHE_FOLER);
    },

    _buildPackageFileLocalPath() {
        return nodePath.join(nodeOs.homedir(), Config.CACHE_FOLER, Config.REMOTE_PACKAGE_NAME);
    }
};

module.exports = VersionManager;