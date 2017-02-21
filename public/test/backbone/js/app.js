/**
 * Created by cinsthexwild on 2017/2/20.
 */

/**
 * Global, define something.
 * @type {{views: {}, models: {}, AppRouter: undefined}}
 */
var App = {};

/**
 * store views
 * @type {{}}
 */
App.views = {};

/**
 * store models
 * @type {{}}
 */
App.models = {};

/**
 * controller
 *
 * Creating a custom router class. Define actions that are triggered when certain URL fragments are matched,
 * and provide a routes hash that pairs routes to actions.
 * Note that you'll want to avoid using a leading slash in your route definitions
 */
App.AppRouter = Backbone.Router.extend({
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
                if (callback) {
                    callback.apply(this, args);
                }
            }, this));
            return false;
        }
        if (callback) {
            callback.apply(this, args);
        }
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
        this.homeView = new App.views.Home();

        // By default, delegateEvents is called within the View's constructor. When delegateEvents is run again, perhaps with a different events hash,
        // all callbacks are removed and delegated afresh — useful for views which need to behave differently when in different modes.
        // this.homeView.delegateEvents({
        //     "keydown input" : "keyAction2"
        // });

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

App.views.Home = Backbone.View.extend({
    el: '.header',
    template: _.template('Hello World.<br><input>'),
    events: {
        "keydown input" : "keyAction"
    },

    initialize: function () {
    },

    render: function () {
        this.$el.html(this.template({}));
        // A good convention is to return this at the end of render to enable chained calls.
        return this;
    },

    keyAction: function(e) {
        if (e.which === 13) {
            alert('input: ' + this.$('input').val());


            this.book1 = new App.views.Book({model: new App.models.Book({name: 'javascript pro'})});
            this.book1.render();
        }
    },

    keyAction2: function(e) {
        if (e.which === '6'.charCodeAt(0)) {
            alert('bingo: ' + this.$('input').val());
        }
    }

});

/**
 * Because hash-based history in Internet Explorer relies on an <iframe>,
 * be sure to call start() only after the DOM is ready.
 */
$(function () {
    // var routeObj = {'home(/)': 'homePage'};
    // app = new App.AppRouter(routeObj);
    app = new App.AppRouter();

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


//////


App.models.Book = Backbone.Model.extend({
    /**
     * The defaults hash (or function) can be used to specify the default attributes for your model.
     * When creating an instance of the model, any unspecified attributes will be set to their default value.
     */
    defaults: {
        name: 'book name',
        author: 'book author'
    }
});

App.views.Book = Backbone.View.extend({
    el: '.content',
    template: _.template('<div><span><%- name %></span>, &copy; <%- author %></div>'),
    model : undefined,
    events: {
        "keydown input" : "keyAction"
    },

    initialize: function () {
        this.model.bind("change", this.render, this);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    keyAction: function(e) {
        if (e.which === 13) {
            alert('input: ' + this.$('input').val());
        }
    }

});