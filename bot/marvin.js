/**
 * Created by rodrigohenriques on 9/29/16.
 */
'use strict';

const util = require('util');
const path = require('path');
const fs = require('fs');
const Bot = require('slackbots');
const messageHandler = require('./message_handler');

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

    if (!this._wasMentioned(message) && !this._isChatMessage(message)) {
        return;
    }

    if (message.type === "message") {
        messageHandler.handle(this, message);
    }
};

Marvin.prototype._wasMentioned = function (message) {
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