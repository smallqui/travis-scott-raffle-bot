const { CookieJar } = require("tough-cookie");
const { status, getRandomProxy, setProxyAgent, increaseSuccess, increaseFailed  } = require("../../lib");
const { Anticaptcha } = require("../captcha");
const { postEntry, getProduct } = require("../requests");
const { entryPayload, extractHandle, extractProduct, extractSizes } = require("../utils");

class RaffleTask {
    constructor(product, id, anticaptcha, catchall){
        this.id = id;
        this.product = product;
        this.anticaptcha = anticaptcha;
        this.catchall = catchall;
        this.proxy = getRandomProxy();
        this.agent = !this.proxy ? false : setProxyAgent(this.proxy);
        this.cookieJar = new CookieJar();
        this.handle = extractHandle(product);
        this.start();
    };

    async controller(step){
        try {
            this.next = await this[step]();
            setTimeout(() => this.controller(this.next));

        }
        catch(error){
            try {
                if(error.message) 
                    status(this.id, error.message, error.type);

                if(/stop/gi.test(error.message)) 
                    throw error;

                setTimeout(() => this.controller(step), error.timeout);
            } 
            catch (error) {
                this.stop();
            };
        };
    };

    start(){
        status(this.id, "Starting Raffle Entry", "blue");
        this.controller("getRaffle");
    };

    getRaffle(){
        return new Promise((resolve, reject) => {
            status(this.id, "Getting Raffle Info", "blue");

            getProduct(this.cookieJar, this.agent)
            .then(({ body }) => {

                let { products } = body;
                let product = extractProduct(this.handle, products);

                if(!product)
                    reject({ message: "Invalid Product!", timeout: 5000, type: "red" });

                else {

                    let { variants } = product;
                    this.sizes = extractSizes(variants);

                    if(!this.sizes)
                        reject({ message: "No Sizes Available!", timeout: 5000, type: "red" });

                    else
                        resolve("pollCaptcha");

                };

            })
            .catch(({ response }) => {

                if(!response)
                    reject({ message: "Request Error Getting Raffle Info!", timeout: 5000, type: "red" });

                else 
                    reject({ message: `Unknown Error Getting Raffle Info! - ${response.statusCode}`, timeout: 500, type: "red" });

            });
        });
    };

    pollCaptcha(){
        return new Promise(async (resolve, reject) => {
            status(this.id, "Polling Captcha", "blue");

            let result = await new Anticaptcha(this.anticaptcha).hcaptcha();

            if(result.status == "success"){

                status(this.id, "Captcha Solved!", "green");
                this.captcha = result.message;
                resolve("enterRaffle");

            }

            else
                reject({ message: "Captcha Failed!", timeout: 6000, type: "red" });

        });
    };

    enterRaffle(){
        return new Promise((resolve, reject) => {
            let size = this.sizes[Math.floor(Math.random() * this.sizes.length)];

            status(this.id, `Entering Raffle (${size})`, "blue");

            let json = entryPayload(size, this.catchall, this.captcha);

            postEntry(json, this.cookieJar, this.agent)
            .then(({ body }) => {

                let { message } = body;

                if(message == "success"){

                    increaseSuccess();
                    status(this.id, `Raffle Entered (${size})!`, "green");

                }

                else {

                    increaseFailed();
                    status(this.id, "Entry Failed!", "red");

                };

            })
            .catch(({ response }) => {

                if(!response)
                    reject({ message: "Request Error Entering Raffle!", timeout: 5000, type: "red" });

                else 
                    reject({ message: `Unknown Error Entering Raffle! - ${response.statusCode}`, timeout: 500, type: "red" });

            });;
        });
    };

    stop(){
        status(this.id, "Task Stopped", "red");
    };
};

module.exports = RaffleTask;