var casper = require('casper').create();

/** time at start of benchmark */
var start = new Date().getTime();

/** Url of forum to test */
var forum_url = "";

/** url of threads to use in benchmark */
var forum_threads = [
    ""
];

/** user account to use when testing */
var forum_user = {
    username: '',
    password: ''
};

var results = [];

casper.start(forum_url, function () {
    this.fill('form[action="login.php?do=login"]', {
        vb_login_username: forum_user.username,
        vb_login_password: forum_user.password
    }, true);
});

casper.each(forum_threads, function(self, link) {
    var total_pages     = 0;
    var page_urls       = [];

    var instance = {
        thread: link,
        pages_opened: 0,
        results: []
    };

    this.thenOpen(link, function() {
        var now = new Date().getTime();
        var url = this.getCurrentUrl();

        instance.pages_total = parseInt(this.getElementAttribute('div[class="pagenav"]', 'data-total-pages'));
        instance.results.push(now - start);

        start = now;

        for (var i = 2; i < 10; i++) {
            page_urls.push(link + '&page=' + i);
        }

        this.eachThen(page_urls, function(response) {
            this.thenOpen(response.data, function(response) {
                var now = new Date().getTime();
                instance.results.push(now - start);
                instance.pages_opened += 1;
                start = now;
            });
        });

        this.then(function () {
            results.push(instance);
            this.echo("TEST COMPLETED:"+ instance.results.length,'GREEN_BAR');
        })
    });
});

casper.then(function () {
    this.echo(JSON.stringify(results));
});

casper.run();
