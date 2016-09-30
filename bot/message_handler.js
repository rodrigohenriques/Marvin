/**
 * Created by rodrigohenriques on 9/30/16.
 */

// Message Handler

const writer = require('../command/writer');
const runner = require('../command/runner');

exports.handle = function(marvin, message) {
    var channel = message.channel;
    var text = message.text;

    var words = text.split(' ');

    if (marvin._wasMentioned(message)) {
        words = words.slice(1);
    }

    var commandFactory = writer.createStash[message.user];

    var commandName = null;

    if (commandFactory === undefined) {
        if (marvin._isChannelConversation(message) && !marvin._wasMentioned(message)) {
            return;
        }

        if (words[0] === 'create') {
            commandName = words[1];

            writer.createStash[message.user] = {
                name: commandName,
                create: writer.createCommand(commandName)
            };

            marvin.postMessage(channel, "Ok, I will create the command **" + commandName + "** for you.\n" +
                "Tell me which JS do you want to run. Remember, I just need the function body.\n" +
                "Your function should return String.", {});
        } else {
            if (runner.hasCommand(words[0])) {
                commandName = words[0];
                var result = runner.execute(commandName);
                marvin.postMessage(channel, result, {});
            } else {
                console.log("posting message");
                marvin.postMessage(channel, "Teach me something...", {});
            }
        }
    } else {
        commandFactory.create(text);
        marvin.postMessage(channel, "Congratulations! Your command **" + commandFactory.name + "** was successfuly created.", {});
        writer.createStash[message.user] = undefined;
    }
};