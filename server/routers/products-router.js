var productsRouter = require('express').Router();
var productsData = require('../data/products-data');
var _ = require('lodash');

var products = productsData;
var id = 12;

var updateId = function (req, res, next) {
    console.log(req.body);
    if (!req.body.id) {
        id++;
        req.body.id = id + '';
    }
    next();
};

productsRouter.param('id', function (req, res, next, id) {
    var event = _.find(products, {id: id});
    if (event) {
        req.event = event;
        next();
    } else {
        res.json({"error": "Id not found"});
    }
});

productsRouter.get('/', function (req, res) {
    const items = {
        products: products,
        totalProducts: 5,
    }
    console.log(items);
    res.json(items);
});

productsRouter.get('/:id', function (req, res) {
    var event = req.event;
    res.json(event || {});
});

productsRouter.post('/', updateId, function (req, res) {
    var event = req.body;

    products.push(event);
    res.status(201).json(event || {});
});

productsRouter.put('/:id', function (req, res) {
    var update = req.body;

    if (update.id) {
        delete update.id;
    }

    var event = _.findIndex(products, {id: req.params.id});

    if (!products[event]) {
        res.send();
    } else {
        var updatedEvent = _.assign(products[event], update);
        res.json(updatedEvent);
    }
});

productsRouter.delete('/:id', function (req, res) {
    var event = _.findIndex(products, {id: req.params.id});
    products.splice(event, 1);

    res.json(req.event);
});

// Error handler
productsRouter.use(function (err, req, res, next) {

    if (err) {
        res.status(500).send(err);
    }

});

module.exports = productsRouter;