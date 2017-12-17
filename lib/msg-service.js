let chalk = require("chalk");

let MsgService ={
    showError(msg) {
        console.log(chalk.red(msg));
    },

    showInfo(title, desc) {
        console.log(chalk.cyan.bold(title, "-", chalk.cyan(desc)));
    }
};

module.exports = MsgService;