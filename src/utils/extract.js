function extractHandle(link){
    let split = link.split("/");
    return split[split.length -1].toLowerCase();
};

function extractProduct(h, products){
    return products.filter(({ handle }) => handle == h)[0];
};

function extractSizes(variants){
    return variants.map(({ title }) => title);
};


module.exports = { extractHandle, extractProduct, extractSizes };