let shelljs = require("shelljs"),
    nodePath = require("path");

let Cp = {
    execute(cmd, basePath) {
        let from = this._buildFromPath(basePath, cmd.from),
            to = this._buildToPath(basePath, cmd.to);

        shelljs.cp("-R", from, to);
    },

    _buildFromPath(basePath, from) {
        return nodePath.join(basePath, from);
    },

    _buildToPath(basePath, to) {
        return nodePath.join(basePath, to);
    }
};

module.exports = Cp;