/**
 * Created by rodrigohenriques on 9/29/16.
 */
'use strict';

const util = require('util');
const path = require('path');
const fs = require('fs');
const Bot = require('slackbots');
const writer = require('../command/writer');
const runner = require('../command/runner');

var Marvin = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'Marvin';
    this.username = settings.username || 'marvin';
};

// inherits methods and properties from the Bot constructor
util.inherits(Marvin, Bot);

Marvin.prototype.run = function () {
    Marvin.super_.call(this, this.settings);

    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

Marvin.prototype._onStart = function () {
    this._loadBotUser();
};

Marvin.prototype._loadBotUser = function () {
    var self = this;

    this.user = this.users.filter(function (user) {
        return user.name === self.username;
    })[0];
};

Marvin.prototype._onMessage = function (message) {
    if (shouldIgnore(this, message)) {
        return;
    }

    logMessage(message);

    var channel = message.channel;

    if (!this._isMentioningMarvin(message) && !this._isChatMessage(message)) {
        return;
    }

    if (message.type === "message") {
        var text = message.text;

        var words = text.split(' ');

        if (this._isMentioningMarvin(message)) {
            words = words.slice(1);
        }

        var command = writer.createStash[message.user];

        if (command === undefined) {
            if (words[0] === 'create') {
                var commandName = words[1];

                writer.createStash[message.user] = {
                    name: commandName,
                    create: writer.createCommand(commandName)
                };

                this.postMessage(channel, "Ok, I will create the command " + commandName + " for you.\n" +
                    "Tell me which JS do you want to run. Remember, I just need the function body.\n" +
                    "Your function should return String.", {});
            } else {
                if (runner.hasCommand(words[0])) {
                    var result = runner.exec(words[0]);
                    this.postMessage(channel, result, {});
                } else {
                    this.postMessage(channel, "Teach me something...");
                }
            }
        } else {
            command.create(text);
            this.postMessage(channel, "Congratulations! Your command " + command.name + " was successfuly created.", {});
            writer.createStash[message.user] = undefined;
        }
    }
};

Marvin.prototype._isMentioningMarvin = function (message) {
    var text = message.text;

    if (text) {
        return text.includes(this.user.id);
    } else {
        return false;
    }
};

Marvin.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

Marvin.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
};

Marvin.prototype._isFromMarvin = function (message) {
    return message.bot_id === this.user.profile.bot_id;
};

Marvin.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};

module.exports = Marvin;


function shouldIgnore(marvin, message) {
    return message.type.indexOf('presence') > -1 ||
        message.type === 'reconnect_url' ||
        message.type === 'user_typing' ||
        marvin._isFromMarvin(message);
}

function logMessage(message) {
    console.log(util.inspect(message));
}