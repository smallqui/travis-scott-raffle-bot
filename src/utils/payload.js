const Chance = require("chance");
const randomWords = require("random-words");
const rrad = require("rrad");
const { v4 } = require("uuid");

let chance = new Chance;

//creates random email phrase
function randomEmail(first, last){
    let phrase = [
        `${first}${last}${chance.prime({ min: 1, max: 2000 })}`.toLowerCase(),
        `${last}${chance.prime({ min: 1, max: 20 })}${chance.string({ length: 7, pool: "michealjordanlebronkobeunc", symbols: false, alpha: true })}`.toLowerCase(),
        randomWords({ min: 3, max: 5, join: '' }).toLowerCase()
    ];

    return phrase[Math.floor(Math.random() * phrase.length)];
};

//idk if theyll flag the rrad addresses so i added a 50% chance of it being a random address
function randomAddress(){
    let address = [
        rrad.addresses[Math.floor(Math.random() * rrad.addresses.length)],
        { address1: chance.address(), address2: chance.prime({ min: 1, max: 4 }).toString(), city: chance.city(), state: chance.state(), postalCode: chance.zip() }
    ];

    return address[Math.floor(Math.random() * address.length)]
};

function entryPayload(size, catchall, captcha){
    let first = chance.first();
    let last = chance.last({ nationality: "es" });
    let email = `${randomEmail(first, last)}${catchall}`;  
    let phone = chance.phone({ country: "us", mobile: "true", formatted: false });
    let address = randomAddress();

    let json = {
        firstName: first,
        lastName: last,
        tel: phone,
        email,
        zip: address.postalCode,
        countryCode: "US",
        id: v4(),
        size,
        captcha
    };
    
    return json;
};

module.exports = { entryPayload };