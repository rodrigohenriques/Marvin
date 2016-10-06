/**
 * Created by rodrigohenriques on 9/29/16.
 */
"use strict";

const fs = require('fs');
const commandsPath = './commands';

var commandCreationStash = {};

module.exports = {
    startCommandCreation: startCommandCreation,
    isCreatingCommand: isCreatingCommand,
    getCommandFactory: getCommandFactory
};

function createCommand(name, code) {
    var template = "templates/simple.template";

    fs.readFile(template, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }

        code = code.replace("&lt;", "<");
        code = code.replace("&gt;", ">");

        var result = data.replace(/#code#/g, code);

        var exists = fs.existsSync(commandsPath);

        if (!exists) fs.mkdirSync(commandsPath);

        var commandFilename = commandsPath + "/" + name + ".js";

        fs.writeFile(commandFilename, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
}

function startCommandCreation(commandName, user) {
    commandCreationStash[user] = {
        create: (code) => createCommand(commandName, code)
    };
}

function getCommandFactory(user) {
    let command = commandCreationStash[user];

    commandCreationStash[user] = undefined;

    return command;
}

function isCreatingCommand(user) {
    return commandCreationStash[user] !== undefined;
}
