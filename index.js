/**
 * Created by rodrigohenriques on 9/29/16.
 */
var writer = require('./command_writer');
var runner = require('./command_runner');

var args = process.argv;
var command = args[2];

writer.addCommand("hello", "console.log('Hello world');");
writer.addCommand("ola", "console.log('Olá mundo');");

