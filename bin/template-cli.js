#!/usr/bin/env node

let commander = require("commander"),
    package = require("../package.json"),
    templateCli = require("../index");

commander
    .version(package.version)
    .option("-s, --server [server-url]", "config server url")
    .option("-t, --template [template-name]", "download template name")
    .option("-e, --edition [template-version]", "download template version")
    .option("-l, --list", "list avaiable template")
    .parse(process.argv);

templateCli.download({
    server: commander.server,
    template: commander.template,
    version: commander.edition,
    list: commander.list
});