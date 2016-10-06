/**
 * Created by rodrigohenriques on 9/29/16.
 */

module.exports = {
    execute: execute,
    hasCommand: hasCommand
};

function execute(command) {
    if (command === undefined) {
        console.log('Undefined command');
        return;
    }

    var commandRunner = getCommand(command);

    if (commandRunner === undefined) {
        console.log('Undefined command');
        return;
    }

    return commandRunner.run();
}

function hasCommand(command) {
    try {
        var commandRunner = getCommand(command);

        return commandRunner !== undefined;
    } catch (err) {
        return false;
    }
}

function getCommand(command) {
    return require('../commands/' + command);
}