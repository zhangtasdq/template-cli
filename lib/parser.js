let decompress = require("decompress"),
    nodePath = require("path"),
    inquirer = require("inquirer");

let Tool = require("./tools"),
    CONFIG = require("./config"),
    Commander = require("./commander");

let Parser = {
    async parse(data) {
        let userOptions = null,
            userChoice = null;

        if (data.options) {
            userOptions = this._parseOptions(data.options);
            userChoice = await inquirer.prompt(userOptions.questions);
        }
        
        let cacheFolder = this._buildCachePath(data);
        await Tool.ensureFolderExist(cacheFolder);
        await this._extractTemplate(data.localPath, cacheFolder);

        if (userOptions) {
            let commander = new Commander(cacheFolder);
            this._executeCmds(commander, userOptions.cmdMaps, userChoice);
        }
        return cacheFolder;
    },

    _executeCmds(commander, cmdMap, choices) {
        for(let key in choices) {
            if (choices.hasOwnProperty(key) && choices[key] === true) {
                let cmds = cmdMap[key];

                for(let i = 0, j = cmds.length; i < j; ++i) {
                    commander.run(cmds[i]);
                }
            }
        }
    },

    _parseOptions(options) {
        let questions = [],
            cmdMaps = {};


        for(let i = 0, j = options.length; i < j; ++i) {
            let item = options[i];

            cmdMaps[item.name] = item.cmds;
            questions.push({
                type: item.type,
                name: item.name,
                message: item.message,
                default: item.default
            });
        }

        return {questions, cmdMaps};
    },

    _extractTemplate(source, dest) {
        return decompress(source, dest);
    },

    _buildCachePath(data) {
        return nodePath.join(data.localFolder, CONFIG.EXTRACT_FOLDER);
    }
};

module.exports = Parser;