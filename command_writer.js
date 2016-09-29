/**
 * Created by rodrigohenriques on 9/29/16.
 */
const fs = require('fs');
const commandsPath = './commands_2';

exports.addCommand = function (name, code) {
    var template = "templates/simple.template";

    fs.readFile(template, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        var result = data.replace(/#code#/g, code);

        var exists = fs.existsSync(commandsPath);

        if (!exists) fs.mkdirSync(commandsPath);

        var commandFilename = commandsPath + "/" + name + ".js";

        fs.writeFile(commandFilename, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
};
