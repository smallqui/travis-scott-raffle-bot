const fs = require("fs");
const path = require("path");
const { HttpProxyAgent, HttpsProxyAgent } = require('hpagent');

let proxyList = fs.readFileSync(path.join(__dirname, "../proxies.txt"), "utf-8").split("\n");;

function getRandomProxy(){
    return proxyList[Math.floor(Math.random() * proxyList.length)];
};

function setProxyAgent(proxy){
    try {
        let credentials = proxy.split(':');
        let agent = `http://${credentials[2]}:${credentials[3]}@${credentials[0]}:${credentials[1]}`;
        return { http: new HttpProxyAgent({ proxy: agent }), https: new HttpsProxyAgent({ proxy: agent }) };
    }
    catch {
        return false;
    }
};

module.exports = { getRandomProxy, setProxyAgent };