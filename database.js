const mongoose = require('mongoose');
const DATABASE_CONECTION = 'mongodb://52.59.231.232:27017/MoonShot';

var moonshotSchema = mongoose.Schema({
    ASIN: [],
    ParentASIN: [],
    DetailPageURL: [],
    ItemLinks: [],
    SalesRank: [],
    SmallImage: [],
    MediumImage: [],
    LargeImage: [],
    ImageSets: [],
    ItemAttributes: [],
    OfferSummary: [],
    Offer: [],
    CustomerReviews: []
});


Item = exports.Item = mongoose.model('products', moonshotSchema);


exports.initializeMongo = function() {
    mongoose.connect(DATABASE_CONECTION);

    console.log('Trying to connect to ' + DATABASE_CONECTION);

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error: We might not be as connected as I thought'));
    db.once('open', function() {
        console.log('We are connected to DB !');
    });
}

Item.insert = function(data) {
    var silence = new Item(data);
    silence.save(function(err, fluffy) {
        if (err) return console.error(err);
        console.log(' ASIN :' + data.ASIN + " Has been added to DB.");
    });
}