/**
 * Created by rodrigohenriques on 9/29/16.
 */
exports.exec = function(command) {
    if (command === undefined) {
        console.log('Undefined command');
        return;
    }

    var commandRunner = require('./commands/' + command + '.js');

    if (commandRunner === undefined) {
        console.log('Undefined command');
        return;
    }

    commandRunner.run();
};