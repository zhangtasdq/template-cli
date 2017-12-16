#!/usr/bin/env node

let commander = require("commander"),
    package = require("../package.json"),
    templateCli = require("../index");

commander
    .version(package.version)
    .option("-c, --config [remote-url]", "config remote url")
    .option("-t, --template [template-name]", "download template name")
    .option("-tv, --templateVersion [template-version]", "download template version")
    .parse(process.argv);

templateCli.start({
    config: commander.config,
    template: commander.template,
    version: commander.templateVersion
});