/**
 * Created by rodrigohenriques on 9/29/16.
 */
var writer = require('./command/writer');

writer.addCommand("hello", "console.log('Hello world');");
writer.addCommand("ola", "console.log('Olá mundo');");

