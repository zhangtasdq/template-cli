let addDevPackage = require("./command/add-dev-package"),
    addScript = require("./command/add-script"),
    cp = require("./command/cp");

class Commander {
    constructor(basePath) {
        this.basePath = basePath;
        this.commandMap = { addDevPackage, addScript, cp };
    }

    run(cmd) {
        if (this.commandMap[cmd.key]) {
            this.commandMap[cmd.key].execute(cmd.value, this.basePath);
        }
    }
}

module.exports = Commander;