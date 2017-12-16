let nodeHttp = require("http"),
    nodeOs = require("os"),
    nodePath = require("path"),
    nodeFs = require("fs"),
    { URL } = require("url"),
    mkdirp = require("mkdirp");

let ConfigManager = require("./config-manager"),
    Config = require("./config"),
    Tool = require("./tools"),
    HttpServer = require("./http-server");

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
            result = {
                version,
                templateName,
                options: packageSection[version].options,
                name: packageSection[version].name,
                path: packageSection[version].path
            }
        }
        return result; 
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