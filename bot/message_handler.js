/**
 * Created by rodrigohenriques on 9/30/16.
 */
"use strict";

const util = require('util');
const writer = require('../command/writer');
const runner = require('../command/runner');

var marvin = {};

exports.init = function(m) {
    marvin = m;
};

exports.handle = function(message) {
    log(message);

    let words = message.text.split(' ');

    if (marvin._wasMentioned(message)) {
        words = words.slice(1);
    }

    let commandName = null;

    if (writer.isCreatingCommand(message.user)) {
        let commandFactory = writer.getCommandFactory(message.user);

        commandFactory.create(message.text);

        marvin.postMessage(message.channel, "Congratulations! Your command **" + commandFactory.name + "** was successfuly created.", {});
    } else {
        if (marvin._isChannelConversation(message) && !marvin._wasMentioned(message)) {
            return;
        }

        if (words[0] === 'create') {
            writer.startCommandCreation(words[1], message.user);

            marvin.postMessage(message.channel,
                "Ok, I will create the command **" + commandName + "** for you.\n" +
                "Tell me which JS do you want to run. Remember, I just need the function body.\n" +
                "Your function must return String.", {});
        } else {
            if (runner.hasCommand(words[0])) {
                commandName = words[0];
                var result = runner.execute(commandName);
                marvin.postMessage(message.channel, result, {});
            } else {
                console.log("posting message");
                marvin.postMessage(message.channel, "Teach me something...", {});
            }
        }
    }
};

function log(message) {
    console.log(util.inspect(message));
}