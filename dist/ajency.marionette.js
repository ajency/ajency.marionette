
/*
 *
 * Ajency.Marionette
 * https://github.com/ajency/ajency.marionette/wiki
 * --------------------------------------------------
 * Version: v0.1.0
 *
 * Copyright(c) 2014 Team Ajency, Ajency.in
 * Distributed under MIT license
 *
 */
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
  var Ajency, NothingFoundView;
  Ajency = {};
  _.extend(Marionette.Application.prototype, {
    appStates: {
      'NothingFound': {
        url: '/*notFound'
      }
    },
    navigate: Backbone.Router.prototype.navigate,
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
      return new Marionette.AppStates({
        app: this
      });
    },
    start: function(options) {
      if (options == null) {
        options = {};
      }
      this.currentUser = window.currentUser;
      this._detectRegions();
      this._registerStates();
      this.triggerMethod('before:start', options);
      this._initCallbacks.run(options, this);
      return this.triggerMethod('start', options);
    },
    controller: function(name, ctrlPrototype) {
      var CtrlClass;
      if (_.isFunction(ctrlPrototype)) {
        CtrlClass = ctrlPrototype;
      } else {
        CtrlClass = (function(_super) {
          __extends(CtrlClass, _super);

          function CtrlClass() {
            return CtrlClass.__super__.constructor.apply(this, arguments);
          }

          return CtrlClass;

        })(Ajency.RegionController);
        _.extend(CtrlClass.prototype, ctrlPrototype);
      }
      this[name] = CtrlClass;
      return this;
    }
  });
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

    CurrentUser.prototype.authenticate = function() {
      var args, responseFn, _currentUser, _this;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _currentUser = this;
      if (this.isLoggedIn()) {
        return;
      }
      _this = this;
      if (_.isObject(args[0])) {
        responseFn = function(response) {
          if (!_.isUndefined(response.error) && response.error === true) {
            _currentUser.trigger('user:auth:failed', response);
            return _this.triggerMethod('user:auth:failed', response);
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
      if (window.currentUser.hasCap(capName)) {
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
      if (!window.currentUser.capExists(capName)) {
        _type = 'not_defined';
      } else if (window.currentUser.capExists(capName) && !window.currentUser.isLoggedIn()) {
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
