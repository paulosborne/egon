var casper = require('casper').create();
var config = require('./config');
var timeStart = new Date().getTime();
var urls    = [];
var pass    = 0;

casper.start();

if (config.httpAuth) {
    casper.setHttpAuth(config.httpAuth.username, config.httpAuth.password);
}

/** Crawling URLs */
casper.thenOpen(config.url, function () {
    var found = this.getElementsAttribute('a','href');
    var url;

    while(found.length) {
        url = found.shift();
        if (urls.indexOf(url) === -1 && url.match(/^[a-z]/)) {
            url = (url.indexOf(config.url) === -1) ? config.url +'/'+ url : url;
            urls.push({ url: url, time: 0, crawled: 0, status: 0});
        }
    }
});

casper.then(function () {
    this.each(urls, function (self, o) {
        this.thenOpen(o.url, function (response) {
            var timeNow = new Date().getTime();

            o.status = response.status;
            o.time = timeNow - timeStart;
            o.crawled = true;

            console.log(JSON.stringify(o));
            timeStart = timeNow;
        });
    });
});

casper.run();



