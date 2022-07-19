const delay = require("delay");
const { postAnticaptcha, getAnticaptcha } = require("../requests");

class Anticaptcha {
    constructor(auth){
        this.auth = auth;
    };

    /*
    url (string): website url the captcha is hosted on
    sitekey (string): the websites Recaptcha sitekey (read: https://anti-captcha.com/apidoc/articles/how-to-find-the-sitekey)
    invisible (bool): is the captcha invisible

    read more;
    https://anti-captcha.com/apidoc/task-types/RecaptchaV2TaskProxyless
    https://anti-captcha.com/apidoc/methods/createTask
    https://anti-captcha.com/apidoc/methods/getTaskResult
    */

    async hcaptcha(){
        let data = new Object;
        let json = new Object;
        let taskId = false;
    
        json = {
            clientKey: this.auth,
            task: {
                type: "HCaptchaTaskProxyless",
                websiteURL: "https://shop.traviscott.com",
                //change this for future relases
                websiteKey: "36d74832-3ba5-4430-832f-ec54914a48e1",
                isInvisible: false,
                userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
            },
            softId: 0
        };

        await postAnticaptcha(json)
        .then(({ body }) => {
            if(!body.errorId){
                taskId = body.taskId;
                data.status = "submitted";
            }
            
            else {
                data.status = "failed";
                data.message = body.errorCode;
            };
        })
        .catch(({ message }) => {
            data.status = "failed";
            data.message = message;
        });

        if(!taskId)
            return data;

        json = {
            clientKey: this.auth,
            taskId
        };

        while(/submitted/.test(data.status)){
            try {
                let { body } = await getAnticaptcha(json);

                if(/processing/.test(body.status))
                    await delay(6000);
                
                else if(/ready/.test(body.status)){
                    data.status = "success";
                    data.message = body.solution.gRecaptchaResponse;
                }

                else {
                    data.status = "failed";
                    data.message = body.errorCode;
                };
            }
            catch {
                await delay(6000);
            };
        };

        return data;
    };
};

module.exports = Anticaptcha;