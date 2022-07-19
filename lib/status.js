const chalk = require("chalk");
const moment = require("moment");

function formattedTime(){
    return moment().format("MM/DD/YYYY HH:mm:ss");
};

function status(id, message, color){
    console.log(chalk[color](`[${formattedTime()}] [Task ${id.toString().padStart(4,'0')}] - ${message}`))
};

module.exports = { status };