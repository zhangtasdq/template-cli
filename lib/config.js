let os = require("os"),
    fs = require("fs"),
    path = require("path");

const CONFIG_FILE_NAME = ".templateclirc.json";
const REMOTE_PACKAGE_NAME = "package.json";
const CACHE_FOLER = ".template-cli"

let config = {
    async setConfig (url) {
        let configConent = await this._loadConfig();
        
        configConent.remoteUrl = url;

        await this._saveConfig(configConent);        
    },

    async getConfig() {
        let configContent = await this._loadConfig();

        return configContent;
    },

    async getPackageUrl() {
        let configContent = await this.getConfig(),
            remoteUrl = configContent.remoteUrl;

        if (remoteUrl[remoteUrl.length -1] === "/") {
            return `${remoteUrl}${REMOTE_PACKAGE_NAME}`;
        }
        
        return `${remoteUrl}/${REMOTE_PACKAGE_NAME}`;
    },

    async buildTemplateDownLoadUrl(templatePath) {
        let configConent = await this.getConfig();

        return configConent.remoteUrl + templatePath;
    },

    getCachePath() {
        return path.join(os.homedir(), CACHE_FOLER);
    },

    _loadConfig() {
        return new Promise((resolve) => {
            let configPath = this._buildConfigPath();

            fs.readFile(configPath, "utf-8", (error, content) => {
                if (error) {
                    resolve({});
                } else {
                    resolve(JSON.parse(content));
                }
            });
        });
    },

    _saveConfig(data) {
        return new Promise((resolve, reject) => {
            let configPath = this._buildConfigPath(),
                dataStr = JSON.stringify(data);
            
            fs.writeFile(configPath, dataStr, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    },

    _buildConfigPath() {
        return path.join(os.homedir(), CONFIG_FILE_NAME);
    }
};

module.exports = config; 