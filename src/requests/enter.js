const got = require("got");

function postEntry(json, cookieJar, agent){
    let url = "https://mq5ejfubh3.execute-api.us-east-1.amazonaws.com/raffle/entry";
    
    let options = {
        json,
        headers: {
            'authority': 'mq5ejfubh3.execute-api.us-east-1.amazonaws.com',
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json;charset=UTF-8',
            'origin': 'https://shop.travisscott.com',
            'referer': 'https://shop.travisscott.com/',
            'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
        },
        cookieJar,
        responseType: 'json',
        followRedirect: false
    };

    agent ? options.agent = agent : null;
    return got.post(url, options);
};

module.exports = { postEntry };