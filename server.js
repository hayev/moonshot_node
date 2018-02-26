console.log("Oh Yeah,Kadima !")
const express = require('express')
const database = require('./database')
const amazon = require('amazon-product-api');

const app = express()


database.initializeMongo();


var client = amazon.createClient({
    awsId: "AKIAIRY2KQBMTVQGZS7Q",
    awsSecret: "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",
    awsTag: "aws Tag"
});


/**
 * The API get ASIN number of product and return the json of product.
 * Check if exist in DB return the json of product, if doesn't exist then get from amazon the data ,insert all fields to DB and return the json.
 * Request : ASIN
 * Response: JSON of product (if the ASIN exist in DB or Amazon), otherwise response (404) and error message. 
 */
app.get('/products/:asin', function(req, res) {

    let ASIN = req.params.asin;
    console.log('\nGOT ASIN : ' + ASIN);

    // Go to find the product by ASIN
    productSearchByASIN(ASIN)
        .then(function(results) { // the item finded
            res.json(results);
        })
        .catch(function() { // doesn't find
            fetchProductFromAmazon(ASIN)
                .then(function(data) {
                    res.json(data); // <<<<<   !!!!!!!!!!!
                    database.Item.insert(data);
                }).catch(function(err) {
                    res.status(404).send(err);
                });

        });


});

/**
 * The API get ASIN number of product ,check if exist in DB then return the json of product, if doesn't return empty json and response (404).
 * Request : ASIN
 * Response: JSON of product (if the ASIN exist in DB ), otherwise response (404)
 */
app.get('/api/products/:asin', function(req, res) {

    let ASIN = req.params.asin;
    console.log('\nGOT ASIN : ' + ASIN);

    // Go to find the product by ASIN
    productSearchByASIN(ASIN)
        .then(function(results) { // the item finded
            res.json(results);
        })
        .catch(function(err) { // doesn't find
            res.status(404).send(err);
        });


});

/**
 *  In wrong case of parametars 
 */
app.get("/*", function(req, res) {
    res.status(404).send('Wrong parameters');
});

/**
 * Search product by ASIN in DB
 * @param {*} ASIN 
 */
var productSearchByASIN = function(ASIN) {

    return new Promise(function(resolve, reject) {
        database.Item.find({ ASIN: ASIN }, function(err, results) {
            if (err) {
                console.log(err);
                reject(err);
            }
            if (results.length) {
                console.log(' Exist in DB');
                return resolve(results);
            } else {
                console.log(" Does't exist in DB");
                reject(results);
            }
        });
    });
}

/**
 *  Get product data from amazon 
 * @param {*} ASIN 
 */
var fetchProductFromAmazon = function(ASIN) {

    return new Promise(function(resolve, reject) {
        client.itemLookup({
            idType: 'ASIN',
            itemId: ASIN,
            responseGroup: 'Images,ItemAttributes,OfferFull,Offers,PromotionSummary,SalesRank,VariationImages,Reviews,OfferSummary'
        }).then(function(results) {
            resolve(results[0]); // Has been finded on Amazon store
        }).catch(function(err) {
            console.log(' The ASIN : ' + ASIN + " doesn't exist on Amazon store.");
            reject(err); //Hasn't been finded on Amazon store
        });
    });
}


/**
 *  Express server listening on port 3000
 */
app.listen(3000, function() {
    console.log('Moonshot app is listening on port 3000!')
})