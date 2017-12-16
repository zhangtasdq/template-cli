let nodeOs = require("os"),
    nodePath = require("path"),
    nodeFs = require("fs");

let CONFIG = require("./config");

let ConfigManager = {
    _configData: null,

    _init() {
        this._configData = this._loadConfigData();
    },

    updateServer(url) {
        this._updateConfig({server: url});
    },

    haveServerUrl() {
        return !!this._configData.server;
    },

    getServerUrl() {
        return this._configData.server;
    },

    _updateConfig(data) {
        for(let key in data) {
            if (data.hasOwnProperty(key)) {
                this._configData[key] = data[key];
            }
        }

        let filePath = this._getConfigFilePath();

        nodeFs.writeFileSync(filePath, JSON.stringify(this._configData));
    },

    _loadConfigData() {
        let filePath = this._getConfigFilePath(),
            isExist = nodeFs.existsSync(filePath),
            result = {};

        if (isExist) {
            let data = nodeFs.readFileSync(filePath, "utf-8");
            result = JSON.parse(data);
        }

        return result;
    },

    _getConfigFilePath() {
        return nodePath.join(nodeOs.homedir(), CONFIG.CONFIG_FILE_NAME);
    }
};

ConfigManager._init();

module.exports = ConfigManager;