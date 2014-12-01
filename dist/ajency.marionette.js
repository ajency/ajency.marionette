var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

(function(root, factory) {
  var Backbone, Handlebars, Marionette, _;
  Backbone = void 0;
  Marionette = void 0;
  _ = void 0;
  if (typeof define === "function" && define.amd) {
    return define(["backbone", "underscore", "backbone.marionette", "handlebars"], function(Backbone, _, Marionette, Handlebars) {
      return root.Ajency = factory(root, Backbone, _, Marionette, Handlebars);
    });
  } else if (typeof exports !== "undefined") {
    Backbone = require("backbone");
    _ = require("underscore");
    Marionette = require("backbone.marionette");
    Handlebars = require("handlebars");
    return module.Ajency = factory(root, Backbone, _, Marionette, Handlebars);
  } else {
    return root.Ajency = factory(root, root.Backbone, root._, root.Marionette, root.Handlebars);
  }
})(this, function(root, Backbone, _, Marionette, Handlebars) {
  "use strict";
  var Ajency;
  Ajency = {};
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
  Ajency.CurrentUser = (function(_super) {
    __extends(CurrentUser, _super);

    function CurrentUser() {
      return CurrentUser.__super__.constructor.apply(this, arguments);
    }

    CurrentUser.prototype.defaults = function() {
      return {};
    };

    CurrentUser.prototype.isLoggedIn = function() {
      return this.has('ID') && this.get('ID') > 0;
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

    CurrentUser.prototype.authenticate = function() {
      var args, responseFn, _currentUser;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _currentUser = this;
      if (this.isLoggedIn()) {
        return;
      }
      if (_.isObject(args[0])) {
        responseFn = function(response) {
          if (!_.isUndefined(response.error) && response.error === true) {
            return _currentUser.trigger('user:auth:failed', response);
          } else {
            _currentUser.set(response);
            return _currentUser.trigger('user:auth:success', _currentUser);
          }
        };
        return $.post("" + APIURL + "/authenticate", args[0], responseFn, 'json');
      }
    };

    return CurrentUser;

  })(Backbone.Model);
  window.currentUser = new Ajency.CurrentUser;
  Ajency.RegionController = (function(_super) {
    __extends(RegionController, _super);

    function RegionController(options) {
      if (options == null) {
        options = {};
      }
      if (!options.region || (options.region instanceof Marionette.Region !== true)) {
        throw new Marionette.Error({
          message: 'region instance is not passed'
        });
      }
      this._ctrlID = _.uniqueId("ctrl-");
      this._region = options.region;
      RegionController.__super__.constructor.call(this, options);
    }

    RegionController.prototype.show = function(view) {
      if (view instanceof Backbone.View !== true) {
        throw new Marionette.Error({
          message: 'view instance is not passed'
        });
      }
      return this._region.show(view);
    };

    return RegionController;

  })(Marionette.Controller);
  Ajency.LoginView = (function(_super) {
    __extends(LoginView, _super);

    function LoginView() {
      return LoginView.__super__.constructor.apply(this, arguments);
    }

    LoginView.prototype.template = '#login-template';

    LoginView.prototype.ui = {
      'loginBtn': '#btn-login',
      'fbLoginBtn': '#btn-fblogin',
      'userLogin': 'input[name="user_login"]',
      'userPass': 'input[name="user_pass"]'
    };

    LoginView.prototype.events = {
      'click @ui.fbLoginBtn': 'loginWithFB',
      'click @ui.loginBtn': 'loginDefault'
    };

    LoginView.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      return this.listenTo(currentUser, 'user:auth:failed', function(response) {
        return this.triggerMethod('user:auth:failed', response);
      });
    };

    LoginView.prototype.loginWithFB = function() {
      return currentUser.authenticate('facebook');
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
      this._view = new Ajency.LoginView;
      return this.show(this._view);
    };

    return LoginCtrl;

  })(Ajency.RegionController);
  return Ajency;
});
