const { status } = require("./status");
const { getRandomProxy, setProxyAgent } = require("./proxies");
const { setTerminalTitle, increaseSuccess, increaseFailed } = require("./title");

module.exports = { status, getRandomProxy, setProxyAgent, setTerminalTitle, increaseSuccess, increaseFailed };