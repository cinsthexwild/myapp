/**
 * Created by cinsthexwild on 2017/2/20.
 */


var app;

/**
 * Creating a custom router class. Define actions that are triggered when certain URL fragments are matched,
 * and provide a routes hash that pairs routes to actions.
 * Note that you'll want to avoid using a leading slash in your route definitions
 */
var AppRouter = Backbone.Router.extend({
    routes: {
        'home(/)': 'homePage', // #home or #home/
        'search/:arg0(/:arg1)': 'search', // #search/arg0/arg1 => (/:optional)
        'search/:arg0/p:arg1/p:arg2': 'search', // #search/arg0/parg1/parg2 => arg0 arg1 arg2
        'file/*path': 'search' // #file/kiwis => will match #file/folder/file.txt, passing "folder/file.txt" to the action.
    },
    initialize: function (options) {
        /**
         * router.route(route, name, [callback])
         * Manually create a route for the router, The route argument may be a routing string or regular expression.
         * Each matching capture from the route or regular expression will be passed as an argument to the callback.
         * The name argument will be triggered as a "route:name" event whenever the route is matched.
         * If the callback argument is omitted router[name] will be used instead. Routes added later may override previously declared routes.
         */
        // Matches #page/10, passing "10"
        this.route('page/:number', 'page', this.page);

        // Matches /117-a/b/c/open, passing "117-a/b/c" to this.open
        this.route(/^(.*?)\/open$/, 'open');
    },

    /**
     * This method is called internally within the router, whenever a route matches and its corresponding callback is about to be executed.
     * Return false from execute to cancel the current transition. Override it to perform custom parsing or wrapping of your routes.
     */
    execute: function(callback, args, name) {
        if (!this.loggedIn) {
            this.goToLogin(_.bind(function () {
                if (callback) callback.apply(this, args);
            }, this));
            return false;
        }
        if (callback) callback.apply(this, args);
    },

    goToLogin: function (callback) {
        this.loggedIn = true;
        alert('logged in');
        if (callback) {
            callback();
            return;
        }

        /**
         * Whenever you reach a point in your application that you'd like to save as a URL,
         * call navigate in order to update the URL. If you also wish to call the route function, set the trigger option to true.
         * To update the URL without creating an entry in the browser's history, set the replace option to true.
         */
        app.navigate("home", {trigger: true, replace: true});
    },

    homePage: function () {
        this.homeView = new HomeView();
        this.homeView.render();
    },

    search: function (arg0, arg1, arg2) {
        alert(JSON.stringify(arguments));
    },

    page: function (arg0) {
        alert('page' + arg0);
    },

    open: function (arg0) {
        alert('regular expression: ' + arg0);
    }
});

var HomeView = Backbone.View.extend({
    el: 'body',
    template: _.template('Hello World.<br><input>'),

    render: function () {
        this.$el.html(this.template({}));
        // A good convention is to return this at the end of render to enable chained calls.
        return this;
    },

    events: {
        "keydown input" : "keyAction",
    },

    keyAction: function(e) {
        if (e.which === 13) {
            alert('input: ' + this.$('input').val());
        }
    }

});

/**
 * Because hash-based history in Internet Explorer relies on an <iframe>,
 * be sure to call start() only after the DOM is ready.
 */
$(function () {
    // var routeObj = {'home(/)': 'homePage'};
    // app = new AppRouter(routeObj);
    app = new AppRouter();

    /**
     * When the visitor presses the back button, or enters a URL, and a particular route is matched,
     * the name of the action will be fired as an event, so that other objects can listen to the router, and be notified.
     */
    app.on('route:search', function () {
        alert('on search: ' + JSON.stringify(arguments));
    });

    /**
     * During page load, after your application has finished creating all of its routers,
     * be sure to call Backbone.history.start() or Backbone.history.start({pushState: true}) to route the initial URL.
     */
    Backbone.history.start();
});