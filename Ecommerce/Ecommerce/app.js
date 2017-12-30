
/**
 * Module dependencies.
 */

// Sources
// https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-elasticsearch-on-ubuntu-16-04
// http://hintdesk.com/how-to-install-and-publish-elasticsearch-on-azure-ubuntu/
// http://www.tugberkugurlu.com/archive/a-gentle-introduction-to-azure-search
// https://objectrocket.com/docs/elastic_node_examples.html#index-a-document
// http://52.165.130.183:9200/products/_search?q=Product_desc:Oracle
// https://www.youtube.com/watch?v=60UsHHsKyN4&t=1304s
// http://www.fusioncharts.com/dev/using-with-server-side-languages/tutorials/creating-interactive-charts-using-node-express-and-mongodb.html
// mongoimport -h ds060649.mlab.com:60649 -d amazon -c retail -u aravindreddy986 -p Aravind --file A:\Big Data\E-Commerce\DBScripts\OnlineRetail.csv --type csv --headerline
// mongo ds060649.mlab.com:60649/amazon -u aravindreddy986 -p Virat@123


// Using npm packages
var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest:'uploads/' });
var routes = require('./routes');
var http = require('http');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();
var multer = require('multer');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var productrouteconfig = require('./routes/productRouteConfig.js');
new productrouteconfig(app)

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*" );
    res.header("Access-Control-Allow-Origin", "Origin, X-Requested-With, Content-Type, Accept, Authorization, sid");
    res.header("Access-Control-Allow-Origin", "POST, GET, OPTIONS, DELETE, PUT");
    next();
});
app.use('/bower_components', express.static(__dirname + '/bower_components'));


// Cloudinary
var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'maravind',
    api_key: '255591374625364',
    api_secret: 'aDXK0itPNfjYniY_NzRI35yKpXA'
});

// Redis Application Cache
var redis = require("redis");
// Add your cache name and access key.
var redisClient = redis.createClient(6380, 'ECommerce.redis.cache.windows.net',
    { auth_pass: 'FSJEx7Aj/OXgx1TtJrMa5yFr0++IUCvTfDSAUJDuOwU=', tls: { servername: 'ECommerce.redis.cache.windows.net' } });
redisClient.on("error", function (err) {
    console.log("Redis Error " + err);
});

redisClient.set('framework', 'Welcome... This application is Deployed in the cloud', function (err, reply) {
    console.log("Successfully Connected to Redis cache server")
});

//#3 Creating Elastic Search Client deployed on Azure Cloud with its hosts and port
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    hosts: [
        {
            protocol: 'http',
            host: '52.173.141.5',
            port: 9200
        }
    ]
});

//Checking id Elastic Search is available.
client.ping({
    requestTimeout: 30000,

}, function (error) {
    if (error) {
        console.error('Cluster is not available !');
    } else {
        console.log('Successfully Connected to Elastic Search');
    }
});

// Mongodb Connection
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var conn = mongoose.connection;
var databaseUrl = "mongodb://aravindreddy986:Aravind@ds060649.mlab.com:60649/amazon";
var options = {
    server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
};

// Connect to MongoDB and use database called Amazon
mongoose.connect(databaseUrl, function (err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + databaseUrl + '. ' + err);
        //res.render(path.join(__dirname + '/views/404'));
    } else {
        console.log('Succeeded connected to: ' + databaseUrl);
    }
});
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function (err, db) { });

redisClient.get('framework', function (err, reply) {
    console.log(reply);
});

var contactSchema = mongoose.Schema({
    Name: String,
    Address1: String,
    Address2: String,
    Address3: String,
    Country: String,
    Email_Address: String,
    Website_address: String,
    Website_Logo: String,
    Phone: String,
    Linkedin: String,
    Github: String
});
var Contact = mongoose.model('Contact', contactSchema);

var productSchema = Schema({
    Product_id: String,
    Product_Name: String,
    Product_desc: String,
    Product_ratings: String,
    List_price: String,
    Sale_price: String,
    Brand_Name: String,
    Paperback: String,
    Language: String,
    Product_Dimensions: String,
    Shipping_Weight: String,
    File_Size: String,
    Imageurl_1: String
});
var ProductModel = mongoose.model('Product', productSchema);

var createproductSchema = Schema({
    
    Product_Name: String,
    Product_desc: String,
    List_price: String,
    booklanguage: String,
    bookauthor: String,
    bookedition: String,
    bookpages: Number,
    Product_Dimensions: String,
    Imageurl_1: String
});
var createproductModel = mongoose.model('createproduct', createproductSchema)

var createBookSchema = Schema({

    Book_id: String,
    Book_name: String,
    Author_name: String,
    Book_Price: Number,
    Language: String,
    Book_type: String,
    Book_edition: String,
    Number_ofpages: String,
    Book_dimensions: String,
    Book_rating: String,
    Book_desc: String,
    Image_url: String

});
var createBookModel = mongoose.model('createbook', createBookSchema)

module.exports = {
    Contact: Contact,
    ProductModel: ProductModel,
    createproductModel: createproductModel
};

module.exports = router;

app.get('/about', routes.about);
app.get('/contact', routes.contact);

app.get('/', function (req, res, next) {

    var products = []

    Contact.find(function (err, Contacts) {
        if (err) return console.error(err);
        var image = Contacts[0].Website_Logo;

        createBookModel.find({}, function (err, result) {
            if (err) return console.error(err);
            
            res.render(path.join(__dirname + '/views/index'), { contactimage: image, data: result });
        });
    });

});

app.get('/FileUpload', function (req, res, next) {

   
    res.render(path.join(__dirname + '/views/FileUpload'));
   
});

app.get('/Update', function (req, res) {

    var contacts = []

    Contact.find(function (err, Contacts) {
        if (err) return console.error(err);

        var contactJson = JSON.stringify(Contacts);
        //console.log(Contacts);

        contacts.push(contactJson);
        res.render(path.join(__dirname + '/views/Update'), { contacts: contacts });

    })

});

app.get('/dashboard', function (req, res, next) {

    var contacts = []

    Contact.find(function (err, Contacts) {
        if (err) return console.error(err);

        var image = Contacts[0].Website_Logo;

        //var contactJson = JSON.stringify(Contacts);
        console.log(typeof image);

        //ontacts.push(contactJson);
        res.render(path.join(__dirname + '/views/dashboard'), { contactimage: image });

    });


});

app.get('/loadProduct', function (req, res) {

    console.log("Calling MongoDB to load product Details!");
    var productId = req.query.productId;

    var books = []
    console.log("User is looking for " + productId);

    Contact.find(function (err, Contacts) {
        if (err) return console.error(err);
        var image = Contacts[0].Website_Logo;

        createBookModel.find({}, function (err, results) {
            if (err) return console.error(err);

            for (var i = 0; i < results.length; i++) {

                redisClient.set(results[i].Book_id, JSON.stringify(results[i]), function (err, reply) {
                    console.log('Object Stored in Redis Cache ');
                });
            }

            redisClient.get(productId, function (err, reply) {

                console.log('Object redisKey retrieved from Redis Cache:' + reply);
                var test = JSON.parse(reply)
                
                console.log(test.Book_name)
                res.render(path.join(__dirname + '/views/loadproduct'), { contactimage: image, data: test });
            });
        });
    });

});

app.post("/GetSearchDetails", function (req, res) {

    var searchItem = req.body.user.name
    var jsonObj;
    var arrSearchResults = []

    console.log("User has searched  for", searchItem);

    client.search({

        index: 'newbooks',
        type: 'newbook',
        body: {
            query: {
                match: {
                    Book_name: searchItem
                }
            }
        }
    }).then(results => {

        results.hits.hits.forEach(function (items) {
            
            // itemsObj = JSON.stringify(items._source);
            arrSearchResults.push(items._source);

        });

        })

    Contact.find(function (err, Contacts) {
                if (err) return console.error(err);
                var image = Contacts[0].Website_Logo;

                //ProductModel.find({}, function (err, result) {
                //    if (err) return console.error(err);

                  // console.log(arrSearchResults);
                //    console.log(arrSearchResults.length);
                    //console.log(result)

                     res.render(path.join(__dirname + '/views/GetSearchDetails'), { contactimage: image, data: arrSearchResults });
                // });
            });


});

app.post('/createtest', function (req, res, next) {
    var cope = req.body;
    console.log('request received:', req.body);
    console.log(cope.author)
    console.log(cope.title)
    console.log(cope.body)

    console.log(req.files.file.name);
    console.log(req.files.file.path);
    console.log(req.files.file.type);

    var mycontact = new Contact({
        Name: cope.author,
        Address1: cope.title,
        Address2: cope.body,
        Address3: 'Kurnool - Andhra Pradesh ',
        Country: 'India',
        Email_Address: 'aravindreddy986@gmail.com',
        Website_Address: 'http://maravind.com/',
        Website_Logo: 'http://res.cloudinary.com/maravind/image/upload/v1492009201/logo_sbxlwv.png',
        Phone: '316-518-2957',
        Linkedin: 'https://www.linkedin.com/in/aravindreddy986',
        Github: 'https://github.com/Aravindreddy986'
    });

    mycontact.save(function (err, result) {
        if (err) { return console.error(err); }
        console.log("Successfull")
    });
});

app.post('/FileUpload', upload.any(), function (req, res, next) {
  
    if (req.files) {
        req.files.forEach(function (file) {

            fs.rename(file.path, 'public/images/' + file.originalname, function (err) {
                if (err) throw err;
                cloudinary.uploader.upload("public/images/" + file.originalname, function (result) {
                   
                    var newproduct = new createproductModel ({
                        Product_Name: req.body.bookname,
                        Product_desc: req.body.bookdesc,
                        List_price: req.body.booklistprice,
                        booklanguage: req.body.booklanguage,
                        bookauthor: req.body.bookauthor,
                        bookedition: req.body.bookedition,
                        bookpages: req.body.bookpages,
                        Product_Dimensions: req.body.bookdimensions,
                        Imageurl_1: result.url
                    });

                    console.log(newproduct)

                    newproduct.save(function (err) {
                        if (err) throw err;

                        console.log('Data saved successfully!');
                        res.render(path.join(__dirname + '/views/FileUpload'));
                    });
                });

            });
    });
    }

    
});

app.post('/create', upload.any(), function (req, res, next) {

    if (req.files) {
        
        req.files.forEach(function (file) {

            fs.rename(file.path, 'public/images/' + file.originalname, function (err) {
                if (err) throw err;
                cloudinary.uploader.upload("public/images/" + file.originalname, function (result) {

                    var newbook = new createBookModel({
                       
                        Book_id: req.body.bookId,
                        Book_name: req.body.bookname,
                        Author_name: req.body.bookauthor,
                        Book_Price: req.body.booklistprice,
                        Language: req.body.booklanguage,
                        Book_type: req.body.booktype,
                        Book_edition: req.body.bookedition,
                        Number_ofpages: req.body.bookpages,
                        Book_dimensions: req.body.bookdimensions,
                        Book_rating: req.body.bookrating,
                        Book_desc: req.body.bookdesc,
                        Image_url: result.url
                    });

                    client.index({
                        index: 'newbooks',
                        type: 'newbook',
                        id: req.body.bookId,
                        body: {
                            Book_id: req.body.bookId,
                            Book_name: req.body.bookname,
                            Author_name: req.body.bookauthor,
                            Book_Price: req.body.booklistprice,
                            Language: req.body.booklanguage,
                            Book_type: req.body.booktype,
                            Book_edition: req.body.bookedition,
                            Number_ofpages: req.body.bookpages,
                            Book_dimensions: req.body.bookdimensions,
                            Book_rating: req.body.bookrating,
                            Book_desc: req.body.bookdesc,
                            Image_url: result.url
                        },
                        refresh: true
                    });

                    newbook.save(function (err) {
                        if (err) throw err;

                        console.log('Data saved successfully!');
                        res.render(path.join(__dirname + '/views/create'));
                    });
                });

            });
        });
    }


});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
