const { product, catchall, anticaptcha, entries } = require("../config.json");
const { setTerminalTitle } = require("../lib/title");
const { RaffleTask } = require("./modes");

function startTask(){
    setTerminalTitle();
    for(let i = 1; i <= entries; i++)
        new RaffleTask(product, i, anticaptcha, catchall);
};

startTask();