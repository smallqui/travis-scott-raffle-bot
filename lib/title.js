let success = 0;
let failed = 0;

function setTerminalTitle(){
    process.stdout.write(String.fromCharCode(27) + "]0;" + `Successful Entries - ${success} | Failed Entries - ${failed}` + String.fromCharCode(7));
};

function increaseSuccess(){
    success++;
    setTerminalTitle();
};

function increaseFailed(){
    failed++;
    setTerminalTitle();
};

module.exports = { setTerminalTitle, increaseSuccess, increaseFailed };