/**
 * Created by rodrigohenriques on 9/29/16.
 */
exports.exec = function(command) {
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
};

exports.hasCommand = function(command) {
    try {
        var commandRunner = getCommand(command);

        return commandRunner !== undefined;
    } catch (err) {
        return false;
    }
};


function getCommand(command) {
    return require('../commands/' + command);
}