/**
 * Created by rodrigohenriques on 9/29/16.
 */
'use strict';

var Marvin = require('./bot/marvin');
var properties = require('./properties.json');

var token = process.env.BOT_API_KEY || properties.token;
var name = process.env.BOT_NAME || properties.name;

var marvin = new Marvin({
    token: token,
    name: name
});

marvin.run();