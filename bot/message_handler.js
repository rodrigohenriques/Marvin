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

    if (writer.isCreatingCommand(message.user)) {
        let commandFactory = writer.getCommandFactory(message.user);

        commandFactory.create(message.text);

        marvin.postMessage(message.channel, `Congratulations! Your command **${commandFactory.name}** was successfully created.`, {});
    } else {
        if (marvin._isChannelConversation(message) && !marvin._wasMentioned(message)) {
            return;
        }

        if (words[0] === 'create') {
            let commandName = words[1];

            writer.startCommandCreation(commandName, message.user);

            marvin.postMessage(message.channel, `Ok, I will create the command **${commandName}** for you.`);
            marvin.postMessage(message.channel, `Tell me which JS do you want to run. Remember, I just need the function body.`);
            marvin.postMessage(message.channel, `Your function must return String.`);
        } else {
            if (runner.hasCommand(words[0])) {
                let commandName = words[0];
                var result = runner.execute(commandName);
                marvin.postMessage(message.channel, result);
            } else {
                marvin.postMessage(message.channel, `Teach me something...`);
            }
        }
    }
};

function log(message) {
    console.log(util.inspect(message));
}