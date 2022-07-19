const got = require('got');

function postAnticaptcha(json){
    let url = "https://api.anti-captcha.com/createTask";

    let options = {
        json,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
        },
        responseType: "json",
        followRedirect: false
    };

    return got.post(url, options);
};

function getAnticaptcha(json){
    let url = "https://api.anti-captcha.com/getTaskResult";

    let options = {
        json,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
        },
        responseType: "json",
        followRedirect: false
    };

    return got.post(url, options);
};

module.exports = { postAnticaptcha, getAnticaptcha };