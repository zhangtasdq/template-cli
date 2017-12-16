let nodePath = require("path"),
    nodeFs = require("fs");

let AddDevPackage = {
    execute(cmds, basePath) {
        let filePath = this._buildPackagePath(basePath),
            contents = nodeFs.readFileSync(filePath),
            data = JSON.parse(contents);

        for(let i = 0, j = cmds.length; i < j; ++i) {
            let item = cmds[i];

            data.devDependencies[item.name] = item.version;
        }

        nodeFs.writeFileSync(filePath, JSON.stringify(data));

    },

    _buildPackagePath(basePath) {
        return nodePath.join(basePath, "base", "package.json");
    }
};

module.exports = AddDevPackage;