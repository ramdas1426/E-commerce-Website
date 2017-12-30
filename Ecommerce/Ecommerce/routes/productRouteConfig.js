function productRouteConfig(app) {
    this.app = app;
    this.routeTable = [];
    this.init();
}

productRouteConfig.prototype.init = function () {
    var self = self
    this.addRoutes();
    this.processRoutes();
}

productRouteConfig.prototype.processRoutes = function () {
    var self = this;
    self.routeTable.forEach(function (route) {
        if (route.requestType == "get") {
            console.log(route);
            self.app.get(route.requestUrl, route.callbackFunction);
        }
        else if (route.requestType == "post") {

            console.log(route);
            self.app.post(route.requestUrl, route.callbackFunction);
        }
        else if (route.requestType == "delete") {
            console.log(route);
            self.app.delete(route.requestUrl, route.callbackFunction);
        }
    });
}

productRouteConfig.prototype.addRoutes = function () {
    var self = this;

    self.routeTable.push({
        requestType: 'get',
        requestUrl: '/create',
        callbackFunction: function (request, response) {
            response.render('create', { title :" Create Product" })
        }
    });

    //self.routeTable.push({
    //    requestType: 'get',
    //    requestUrl: '/View',
    //    callbackFunction: function (request, response) {
    //        response.render('View', { title: " View or Update Products" })
    //    }
    //});

}
module.exports = productRouteConfig;