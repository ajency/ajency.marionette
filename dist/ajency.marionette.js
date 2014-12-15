
/*
 *
 * Ajency.Marionette
 * https://github.com/ajency/ajency.marionette/wiki
 * --------------------------------------------------
 * Version: v0.2.3
 *
 * Copyright(c) 2014 Team Ajency, Ajency.in
 * Distributed under MIT license
 *
 */
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

(function(root, factory) {
  var $, Backbone, Handlebars, Marionette, _;
  Backbone = void 0;
  Marionette = void 0;
  _ = void 0;
  if (typeof define === "function" && define.amd) {
    return define(["jquery", "backbone", "underscore", "backbone.marionette", "handlebars"], function($, Backbone, _, Marionette, Handlebars) {
      return root.Ajency = factory(root, $, Backbone, _, Marionette, Handlebars);
    });
  } else if (typeof exports !== "undefined") {
    $ = require("jquery");
    Backbone = require("backbone");
    _ = require("underscore");
    Marionette = require("backbone.marionette");
    Handlebars = require("handlebars");
    return module.Ajency = factory(root, $, Backbone, _, Marionette, Handlebars);
  } else {
    return root.Ajency = factory(root, root.$, root.Backbone, root._, root.Marionette, root.Handlebars);
  }
})(this, function(root, $, Backbone, _, Marionette, Handlebars) {
  "use strict";
  var Ajency, NothingFoundView, authNS, currentUser, currentUserNS;
  Ajency = {};
  authNS = $.initNamespaceStorage('auth');
  currentUserNS = $.initNamespaceStorage('currentUser');
  _.extend(Marionette.TemplateCache, {
    get: function(template) {
      var cachedTemplate, templateId;
      templateId = template.substr(template.length - 8) === 'template';
      if (!templateId) {
        return Marionette.TemplateCache.prototype.nonScriptTemplate(template);
      }
      templateId = template;
      cachedTemplate = this.templateCaches[templateId];
      if (!cachedTemplate) {
        cachedTemplate = new Marionette.TemplateCache(templateId);
        this.templateCaches[templateId] = cachedTemplate;
      }
      return cachedTemplate.load();
    }
  });
  _.extend(Marionette.TemplateCache.prototype, {
    nonScriptTemplate: function(template) {
      return this.compileTemplate(template);
    },
    compileTemplate: function(rawTemplate) {
      return Handlebars.compile(rawTemplate);
    }
  });
  _.mixin({
    isFbDefined: function() {
      return typeof FB === 'object';
    }
  });
  Ajency.CurrentUser = (function(_super) {
    __extends(CurrentUser, _super);

    function CurrentUser() {
      this._setProfilePicture = __bind(this._setProfilePicture, this);
      return CurrentUser.__super__.constructor.apply(this, arguments);
    }

    CurrentUser.prototype.defaults = function() {
      return {};
    };

    CurrentUser.prototype.initialize = function(opt) {
      if (currentUserNS.localStorage.isSet('userModel')) {
        return this.set(currentUserNS.localStorage.get('userModel'));
      }
    };

    CurrentUser.prototype.isLoggedIn = function() {
      return authNS.localStorage.isSet('HTTP_X_API_KEY');
    };

    CurrentUser.prototype.logout = function() {
      authNS.localStorage.removeAll();
      currentUserNS.localStorage.removeAll();
      return this.trigger('user:logged:out');
    };

    CurrentUser.prototype.hasCap = function(capName) {
      var caps;
      if (capName == null) {
        capName = '';
      }
      if (!this.has('caps')) {
        return false;
      }
      caps = this.get('caps');
      if (_.isObject(caps) && !_.isUndefined(caps[capName]) && caps[capName] === true) {
        return true;
      }
      return false;
    };

    CurrentUser.prototype.capExists = function(capName) {
      var caps;
      if (!this.has('caps')) {
        return false;
      }
      caps = this.get('caps');
      if (!_.isUndefined(caps[capName])) {
        return true;
      }
      return false;
    };

    CurrentUser.prototype.getFacebookPicture = function() {
      var options;
      if (!_.isFbDefined()) {
        return;
      }
      options = {
        "redirect": false,
        "height": "200",
        "type": "normal",
        "width": "200"
      };
      return FB.api("/me/picture", options, this._setProfilePicture);
    };

    CurrentUser.prototype._setProfilePicture = function(resp) {
      var _picture;
      if (resp && !resp.error) {
        _picture = {
          'id': 0,
          'sizes': {
            "thumbnail": {
              "height": 150,
              "width": 150,
              "url": resp.data.url
            }
          }
        };
        return this.set('profile_picture', _picture);
      }
    };

    CurrentUser.prototype.authenticate = function() {
      var accessToken, args, data, responseFn, userData, userLogin, _currentUser, _this;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _currentUser = this;
      _this = this;
      responseFn = function(response, status, xhr) {
        if (_.isUndefined(response.ID)) {
          _currentUser.trigger("user:auth:failed", response);
          return _this.trigger("user:auth:failed", response);
        } else {
          authNS.localStorage.set("HTTP_X_API_KEY", xhr.getResponseHeader("HTTP_X_API_KEY"));
          authNS.localStorage.set("HTTP_X_SHARED_SECRET", xhr.getResponseHeader("HTTP_X_SHARED_SECRET"));
          currentUserNS.localStorage.set("userModel", response);
          _currentUser.set(response);
          return _currentUser.trigger("user:auth:success", _currentUser);
        }
      };
      if (_.isString(args[0])) {
        userData = args[1];
        accessToken = args[2];
        userLogin = "FB_" + userData.id;
        data = {
          user_login: userLogin,
          user_pass: accessToken,
          type: "facebook",
          userData: userData
        };
        return $.post("" + APIURL + "/authenticate", data, responseFn, "json");
      } else if (_.isObject(args[0])) {
        return $.post("" + APIURL + "/authenticate", args[0], responseFn, "json");
      }
    };

    return CurrentUser;

  })(Backbone.Model);
  currentUser = new Ajency.CurrentUser;
  jQuery.ajaxSetup({
    beforeSend: function(xhr, settings) {
      var HTTP_X_API_KEY, HTTP_X_SHARED_SECRET, apiSignature, args, timeStamp;
      if (!authNS.localStorage.isSet('HTTP_X_API_KEY')) {
        return;
      }
      apiSignature = '';
      timeStamp = _.now();
      HTTP_X_API_KEY = authNS.localStorage.get('HTTP_X_API_KEY');
      HTTP_X_SHARED_SECRET = authNS.localStorage.get('HTTP_X_SHARED_SECRET');
      args = {
        'api_key': HTTP_X_API_KEY,
        'timestamp': timeStamp + '',
        'request_method': settings.type,
        'request_uri': settings.url.replace(window.location.origin, '')
      };
      apiSignature = CryptoJS.MD5(JSON.stringify(args) + HTTP_X_SHARED_SECRET);
      xhr.setRequestHeader('HTTP_X_API_KEY', HTTP_X_API_KEY);
      xhr.setRequestHeader('HTTP_X_API_TIMESTAMP', timeStamp);
      return xhr.setRequestHeader('HTTP_X_API_SIGNATURE', apiSignature);
    }
  });
  _.extend(Marionette.Application.prototype, {
    appStates: {
      'NothingFound': {
        url: '/*notFound'
      }
    },
    navigate: Backbone.Router.prototype.navigate,
    getCurrentRoute: function() {
      return Backbone.history.getFragment();
    },
    state: function(name, def) {
      if (def == null) {
        def = {};
      }
      this.appStates[name] = def;
      return this;
    },
    _registerStates: function() {
      Marionette.RegionControllers.prototype.controllers = this;
      _.extend(Marionette.AppStates.prototype, {
        appStates: this.appStates
      });
      return this.router = new Marionette.AppStates({
        app: this
      });
    },
    start: function(options) {
      if (options == null) {
        options = {};
      }
      this.currentUser = currentUser;
      this._detectRegions();
      this._registerStates();
      this.triggerMethod('before:start', options);
      this._initCallbacks.run(options, this);
      return this.triggerMethod('start', options);
    }
  });

  /*
  	 * Ajency.ActiveLinkBehavior
   */
  Ajency.ActiveLinkBehavior = (function(_super) {
    __extends(ActiveLinkBehavior, _super);

    function ActiveLinkBehavior() {
      return ActiveLinkBehavior.__super__.constructor.apply(this, arguments);
    }

    ActiveLinkBehavior.prototype.defaults = function() {
      return {
        app: false
      };
    };

    ActiveLinkBehavior.prototype.events = {
      'click @ui.ul li': 'setActiveLink'
    };

    ActiveLinkBehavior.prototype.setActiveLink = function(evt) {
      $(evt.currentTarget).siblings().removeClass('active');
      return $(evt.currentTarget).addClass('active');
    };

    return ActiveLinkBehavior;

  })(Marionette.Behavior);
  Ajency.NoAccessView = (function(_super) {
    __extends(NoAccessView, _super);

    function NoAccessView() {
      return NoAccessView.__super__.constructor.apply(this, arguments);
    }

    NoAccessView.prototype.template = '#no-access-template';

    NoAccessView.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      return this.type = options.type, options;
    };

    NoAccessView.prototype.mixinTemplateHelpers = function(data) {
      data = NoAccessView.__super__.mixinTemplateHelpers.call(this, data);
      data[this.type] = true;
      return data;
    };

    return NoAccessView;

  })(Marionette.ItemView);
  Ajency.RegionController = (function(_super) {
    __extends(RegionController, _super);

    function RegionController(options) {
      var capName;
      if (options == null) {
        options = {};
      }
      if (!options.region || (options.region instanceof Marionette.Region !== true)) {
        throw new Marionette.Error({
          message: 'Region instance is not passed'
        });
      }
      this._ctrlID = _.uniqueId('ctrl-');
      this._region = options.region;
      capName = "access_" + options.stateName;
      capName = capName.toLowerCase();
      if (currentUser.hasCap(capName)) {
        RegionController.__super__.constructor.call(this, options);
      } else {
        this._showNoAccessView(capName);
      }
    }

    RegionController.prototype._showNoAccessView = function(capName) {
      var _type;
      _type = this._getNoAccessType(capName);
      return this.show(new Ajency.NoAccessView({
        type: _type
      }));
    };

    RegionController.prototype._getNoAccessType = function(capName) {
      var _type;
      if (!currentUser.capExists(capName)) {
        _type = 'not_defined';
      } else if (currentUser.capExists(capName) && !currentUser.isLoggedIn()) {
        _type = 'no_access_login';
      } else {
        _type = 'no_access';
      }
      return _type;
    };

    return RegionController;

  })(Marionette.RegionController);
  Ajency.LoginView = (function(_super) {
    __extends(LoginView, _super);

    function LoginView() {
      this._fbLoginHandler = __bind(this._fbLoginHandler, this);
      this.loginWithFacebook = __bind(this.loginWithFacebook, this);
      return LoginView.__super__.constructor.apply(this, arguments);
    }

    LoginView.prototype.template = '#login-template';

    LoginView.prototype.ui = {
      'loginBtn': '.aj-login-button',
      'fbLoginButton': '.aj-fb-login-button',
      'userLogin': 'input[name="user_login"]',
      'userPass': 'input[name="user_pass"]'
    };

    LoginView.prototype.events = {
      'click @ui.loginBtn': 'loginDefault',
      'click @ui.fbLoginButton': 'loginWithFacebook'
    };

    LoginView.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      return this.listenTo(currentUser, 'user:auth:failed', function(response) {
        return this.triggerMethod('user:auth:failed', response);
      });
    };

    LoginView.prototype.loginWithFacebook = function(evt) {
      var _scope;
      if (!_.isFbDefined()) {
        throw new Marionette.Error('Please add facebook SDK');
      }
      _scope = this.ui.fbLoginButton.attr('fb-scope');
      _scope = !_.isString(_scope) ? '' : _scope;
      return FB.login(this._fbLoginHandler, {
        scope: _scope
      });
    };

    LoginView.prototype._fbLoginHandler = function(response) {
      if (response.authResponse) {
        return FB.api('/me', (function(_this) {
          return function(user) {
            return _this.triggerMethod('facebook:login:success', user, response.authResponse.accessToken);
          };
        })(this));
      } else {
        return this.triggerMethod('facebook:login:cancel');
      }
    };

    LoginView.prototype.loginDefault = function() {
      var data;
      data = {
        user_login: this.ui.userLogin.val(),
        user_pass: this.ui.userPass.val()
      };
      return currentUser.authenticate(data);
    };

    return LoginView;

  })(Marionette.ItemView);
  Ajency.LoginCtrl = (function(_super) {
    __extends(LoginCtrl, _super);

    function LoginCtrl() {
      return LoginCtrl.__super__.constructor.apply(this, arguments);
    }

    LoginCtrl.prototype.initialize = function() {
      var loginView;
      loginView = new Ajency.LoginView;
      this.listenTo(loginView, 'facebook:login:success', this._facebookAuthSuccess);
      this.listenTo(loginView, 'facebook:login:cancel', this._facebookAuthCancel);
      return this.show(loginView);
    };

    LoginCtrl.prototype._facebookAuthSuccess = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return currentUser.authenticate.apply(currentUser, ['facebook'].concat(__slice.call(args)));
    };

    LoginCtrl.prototype._facebookAuthCancel = function() {
      return currentUser.trigger('user:auth:cancel');
    };

    return LoginCtrl;

  })(Marionette.RegionController);
  NothingFoundView = (function(_super) {
    __extends(NothingFoundView, _super);

    function NothingFoundView() {
      return NothingFoundView.__super__.constructor.apply(this, arguments);
    }

    NothingFoundView.prototype.template = '#404-template';

    return NothingFoundView;

  })(Marionette.ItemView);
  Ajency.NothingFoundCtrl = (function(_super) {
    __extends(NothingFoundCtrl, _super);

    function NothingFoundCtrl() {
      return NothingFoundCtrl.__super__.constructor.apply(this, arguments);
    }

    NothingFoundCtrl.prototype.initialize = function() {
      return this.show(new NothingFoundView);
    };

    return NothingFoundCtrl;

  })(Marionette.RegionController);
  return Ajency;
});
