
/*
 *
 * Ajency.Marionette
 * https://github.com/ajency/ajency.marionette/wiki
 * --------------------------------------------------
 * Version: v0.4.1
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
  var Ajency, NothingFoundView, authNS, currentUser, currentUserNS, currentUserTemplate, loginViewTemplate, uploadTemplate;
  Ajency = {};
  authNS = $.initNamespaceStorage('auth');
  currentUserNS = $.initNamespaceStorage('currentUser');
  if (!window.cordova) {
    window.facebookConnectPlugin = {
      getLoginStatus: function(s, f) {
        var error;
        try {
          FB.getLoginStatus(function(response) {
            s(response);
          });
        } catch (_error) {
          error = _error;
          if (!f) {
            console.error(error.message);
          } else {
            f(error.message);
          }
        }
      },
      showDialog: function(options, s, f) {
        var error;
        if (!options.name) {
          options.name = "";
        }
        if (!options.message) {
          options.message = "";
        }
        if (!options.caption) {
          options.caption = "";
        }
        if (!options.description) {
          options.description = "";
        }
        if (!options.href) {
          options.href = "";
        }
        if (!options.picture) {
          options.picture = "";
        }
        try {
          FB.ui(options, function(response) {
            if (response && (response.request || !response.error_code)) {
              s(response);
            } else {
              f(response);
            }
          });
        } catch (_error) {
          error = _error;
          if (!f) {
            console.error(error.message);
          } else {
            f(error.message);
          }
        }
      },
      login: function(permissions, s, f) {
        var permissionObj;
        permissionObj = {};
        if (permissions && permissions.length > 0) {
          permissionObj.scope = permissions.toString();
        }
        FB.login((function(response) {
          if (response.authResponse) {
            s(response);
          } else {
            f(response.status);
          }
        }), permissionObj);
      },
      getAccessToken: function(s, f) {
        var response;
        response = FB.getAccessToken();
        if (!response) {
          if (!f) {
            console.error("NO_TOKEN");
          } else {
            f("NO_TOKEN");
          }
        } else {
          s(response);
        }
      },
      logEvent: function(eventName, params, valueToSum, s, f) {
        s();
      },
      logPurchase: function(value, currency, s, f) {
        s();
      },
      logout: function(s, f) {
        var error;
        try {
          FB.logout(function(response) {
            s(response);
          });
        } catch (_error) {
          error = _error;
          if (!f) {
            console.error(error.message);
          } else {
            f(error.message);
          }
        }
      },
      api: function(graphPath, permissions, s, f) {
        var error;
        try {
          FB.api(graphPath, function(response) {
            if (response.error) {
              f(response);
            } else {
              s(response);
            }
          });
        } catch (_error) {
          error = _error;
          if (!f) {
            console.error(error.message);
          } else {
            f(error.message);
          }
        }
      },
      browserInit: function(app, appId, version) {
        if (version == null) {
          version = 'v2.2';
        }
        return window.fbAsyncInit = function() {
          FB.init({
            appId: appId,
            cookie: true,
            xfbml: true,
            version: version
          });
          return FB.getLoginStatus(function(response) {
            if (response.status === "connected") {
              return app.trigger('fb:status:connected');
            }
          });
        };
      }
    };
    (function() {
      var e;
      if (!window.FB && $("#fb-root").length > 0) {
        console.log("launching FB SDK");
        e = document.createElement("script");
        e.src = document.location.protocol + "//connect.facebook.net/en_US/sdk.js";
        e.async = true;
        document.getElementById("fb-root").appendChild(e);
      }
    })();
  }
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
  window.notLoggedInCaps = window.notLoggedInCaps || {};
  window.allSystemCaps = window.allSystemCaps || [];
  Ajency.notLoggedInCapExists = function(capName) {
    if (!_.isObject(window.notLoggedInCaps)) {
      return false;
    }
    if (!window.notLoggedInCaps[capName]) {
      return false;
    }
    return true;
  };
  Ajency.allSystemCapExists = function(capName) {
    return _.indexOf(window.allSystemCaps, capName) !== -1;
  };
  Ajency.CurrentUser = (function(_super) {
    __extends(CurrentUser, _super);

    function CurrentUser() {
      this._setProfilePicture = __bind(this._setProfilePicture, this);
      return CurrentUser.__super__.constructor.apply(this, arguments);
    }

    CurrentUser.prototype.idAttribute = 'ID';

    CurrentUser.prototype.defaults = function() {
      return {
        caps: {}
      };
    };

    CurrentUser.prototype.isLoggedIn = function() {
      return this.isNew() === false;
    };

    CurrentUser.prototype.logout = function() {
      this.clear({
        slient: true
      });
      authNS.localStorage.removeAll();
      this.setNotLoggedInCapabilities();
      return this.trigger('user:logged:out');
    };

    CurrentUser.prototype.setNotLoggedInCapabilities = function() {
      return this.set('caps', window.notLoggedInCaps);
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
      return facebookConnectPlugin.api("/me/picture?width=200", [], this._setProfilePicture);
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
      var accessToken, args, data, responseFn, userData, userLogin, xhr, _currentUser, _this;
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
        xhr = $.post("" + APIURL + "/authenticate", data, responseFn, "json");
      } else if (_.isObject(args[0])) {
        xhr = $.post("" + APIURL + "/authenticate", args[0], responseFn, "json");
      }
      return xhr;
    };

    return CurrentUser;

  })(Backbone.Model);
  currentUser = new Ajency.CurrentUser;
  jQuery.ajaxSetup({
    beforeSend: function(xhr, settings) {
      var HTTP_X_API_KEY, HTTP_X_SHARED_SECRET, apiSignature, args, timeStamp;
      if (typeof WP_API_NONCE !== 'undefined') {
        xhr.setRequestHeader('X-WP-Nonce', WP_API_NONCE);
        return;
      }
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
    initialize: function(options) {
      if (options == null) {
        options = {};
      }
      return this.currentUser = currentUser;
    },
    appStates: {
      'NothingFound': {
        url: '/*notFound'
      }
    },
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
      this._detectRegions();
      this.triggerMethod('before:start', options);
      this._registerStates();
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
  Ajency.FormBehavior = (function(_super) {
    __extends(FormBehavior, _super);

    function FormBehavior() {
      this._showRequestFailerMessage = __bind(this._showRequestFailerMessage, this);
      this._showSuccessMessage = __bind(this._showSuccessMessage, this);
      return FormBehavior.__super__.constructor.apply(this, arguments);
    }

    FormBehavior.prototype.ui = {
      submitButton: '.aj-submit-button',
      responseMessage: '.aj-response-message'
    };

    FormBehavior.prototype.defaults = function() {
      return {
        successMessage: 'Enter your success message in behavior options',
        errorMessage: 'Enter your error message in behavior options'
      };
    };

    FormBehavior.prototype.events = {
      'click @ui.submitButton': '_validateForm'
    };

    FormBehavior.prototype.initialize = function() {
      this.listenTo(this.view, 'render', this._initMasking);
      this.listenTo(this.view, 'render', this._initValidation);
      this.listenTo(this.view, 'destroy', this._cleanUpView);
      this.view.showSuccessMessage = this._showSuccessMessage;
      return this.view.showRequestFailerMessage = this._showRequestFailerMessage;
    };

    FormBehavior.prototype._initMasking = function() {
      var inputFields;
      inputFields = this.view.$('[aj-inputmask]');
      return inputFields.each(function(index, field) {
        return $(field).inputmask($(field).attr('aj-inputmask'));
      });
    };

    FormBehavior.prototype._initValidation = function() {
      if (this.view.$el.prop('tagName') === 'FORM') {
        this.form = this.view.$el;
      } else {
        if (this.view.$('form').length === 0) {
          throw new Marionette.Error('Form tag missing. Please add a form');
        }
        this.form = this.view.$('form');
      }
      this.form.attr('data-parsley-namespace', 'aj-field-');
      this.validator = this.view.validator = $(this.form).parsley();
      $(this.form).parsley().subscribe('parsley:form:validate', (function(_this) {
        return function(formInstance) {
          return _this.view.triggerMethod('form:validate', formInstance);
        };
      })(this));
      $(this.form).parsley().subscribe('parsley:form:validated', (function(_this) {
        return function(formInstance) {
          return _this.view.triggerMethod('form:validated', formInstance);
        };
      })(this));
      $(this.form).parsley().subscribe('parsley:field:validate', (function(_this) {
        return function(formInstance) {
          return _this.view.triggerMethod('field:validate', formInstance);
        };
      })(this));
      $(this.form).parsley().subscribe('parsley:field:success', (function(_this) {
        return function(formInstance) {
          return _this.view.triggerMethod('field:success', formInstance);
        };
      })(this));
      return $(this.form).parsley().subscribe('parsley:field:error', (function(_this) {
        return function(formInstance) {
          return _this.view.triggerMethod('field:error', formInstance);
        };
      })(this));
    };

    FormBehavior.prototype._cleanUpView = function() {
      delete this.view.validator;
      delete this.view.showSuccessMessage;
      return delete this.view.showRequestFailerMessage;
    };

    FormBehavior.prototype._validateForm = function(evt) {
      var formData;
      evt.preventDefault();
      if (this.validator.validate()) {
        this.ui.submitButton.addClass('aj-form-submit-in-process');
        formData = Backbone.Syphon.serialize(this.view);
        return this.view.triggerMethod('form:submit', formData);
      }
    };

    FormBehavior.prototype._showSuccessMessage = function() {
      this.ui.responseMessage.addClass('alert-success').html(this.options.successMessage);
      return this._removeFormSubmitClass();
    };

    FormBehavior.prototype._showRequestFailerMessage = function() {
      this.ui.responseMessage.addClass('alert-danger').html(this.options.errorMessage);
      return this._removeFormSubmitClass();
    };

    FormBehavior.prototype._removeFormSubmitClass = function() {
      return this.ui.submitButton.removeClass('aj-form-submit-in-process');
    };

    return FormBehavior;

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
      capName = ("access_" + options.stateName).toLowerCase();
      if (Ajency.allSystemCapExists(capName) && currentUser.hasCap(capName)) {
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
      if (!Ajency.allSystemCapExists(capName)) {
        _type = 'not_defined';
      } else if (currentUser.isLoggedIn() && !currentUser.hasCap(capName)) {
        _type = 'no_access';
      } else if (!currentUser.isLoggedIn() && Ajency.allSystemCapExists(capName)) {
        _type = 'no_access_login';
      }
      return _type;
    };

    return RegionController;

  })(Marionette.RegionController);
  loginViewTemplate = '<div class="container-fluid"> <div class="row"> <div class="col-md-12"> <h3 class="special brand text-center m-b-50 m-t-5">Sign In</h3> <div class="response-message"></div> <div class="form-group fly-group m-t-20"> <label class="fly-label classic">Username</label> <input type="text" required name="user_login" id="user_login" class="srch-filters form-control" placeholder="Username" aria-label="Username"> <span class="fa fa-user form-control-feedback" aria-hidden="true"></span> </div> <div class="form-group fly-group m-t-30"> <label class="fly-label classic">Password</label> <input type="password" required name="user_pass" id="user_pass" class="srch-filters form-control" placeholder="Password" aria-label="Password"> <span class="fa fa-lock form-control-feedback" aria-hidden="true"></span> </div> <button type="button" class="btn btn-primary btn-block raised aj-submit-button aj-login-button m-t-40 m-b-20">SIGN IN</button> </div> </div> </div>';
  Ajency.LoginView = (function(_super) {
    __extends(LoginView, _super);

    function LoginView() {
      this._fbLoginSuccess = __bind(this._fbLoginSuccess, this);
      this._fbFailureLoginHandler = __bind(this._fbFailureLoginHandler, this);
      this._fbSuccessLoginHandler = __bind(this._fbSuccessLoginHandler, this);
      this.loginWithFacebook = __bind(this.loginWithFacebook, this);
      return LoginView.__super__.constructor.apply(this, arguments);
    }

    LoginView.prototype.tagName = 'form';

    LoginView.prototype.template = Handlebars.compile(loginViewTemplate);

    LoginView.prototype.ui = {
      'responseMessage': '.response-message',
      'loginBtn': '.aj-submit-button',
      'fbLoginButton': '.aj-fb-login-button',
      'userLogin': 'input[name="user_login"]',
      'userPass': 'input[name="user_pass"]'
    };

    LoginView.prototype.events = {
      'click @ui.loginBtn': 'loginDefault',
      'click @ui.fbLoginButton': 'loginWithFacebook'
    };

    LoginView.prototype.behaviors = {
      FormBehavior: {
        behaviorClass: Ajency.FormBehavior
      }
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
      $(evt.target).text('Logging in... Please Wait...');
      this.$('.authentication-cancelled').empty();
      _scope = this._getScope();
      return facebookConnectPlugin.getLoginStatus((function(_this) {
        return function(resp) {
          if (resp.status !== 'connected') {
            return facebookConnectPlugin.login(_scope, _this._fbSuccessLoginHandler, _this._fbFailureLoginHandler);
          } else {
            return _this._fbLoginSuccess();
          }
        };
      })(this));
    };

    LoginView.prototype._getScope = function() {
      var _scope;
      _scope = this.ui.fbLoginButton.attr('fb-scope');
      _scope = !_.isString(_scope) ? '' : _scope;
      _scope = _scope.split(',');
      return _scope;
    };

    LoginView.prototype._fbSuccessLoginHandler = function(response) {
      if (response.authResponse) {
        return this._fbLoginSuccess();
      }
    };

    LoginView.prototype._fbFailureLoginHandler = function() {
      this.triggerMethod('facebook:login:cancel');
      this.ui.fbLoginButton.text('Login with Facebook');
      return this.ui.fbLoginButton.after('<p class="text-center authentication-cancelled">Authentication cancelled by user</p>');
    };

    LoginView.prototype._fbLoginSuccess = function() {
      return facebookConnectPlugin.api('/me', [], (function(_this) {
        return function(user) {
          return facebookConnectPlugin.getAccessToken(function(token) {
            return _this.trigger('facebook:login:success', user, token);
          });
        };
      })(this));
    };

    LoginView.prototype.onFormSubmit = function(data) {
      this.ui.responseMessage.empty().removeClass('alert alert-danger');
      this.ui.loginBtn.text('Signing in... Please Wait...');
      data = {
        user_login: this.ui.userLogin.val(),
        user_pass: this.ui.userPass.val()
      };
      return currentUser.authenticate(data).done((function(_this) {
        return function(response) {
          var failMessage;
          if (_.isUndefined(response.ID)) {
            _this.triggerMethod('basic:login:failure', response);
            failMessage = response[0].message;
            _this.ui.responseMessage.addClass('alert alert-danger').html(failMessage);
            return _this.ui.loginBtn.text('Sign in');
          }
        };
      })(this)).fail((function(_this) {
        return function() {
          var args, failMessage;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          failMessage = 'Request failed. Please try again';
          _this.ui.responseMessage.addClass('alert alert-danger').html(failMessage);
          return _this.ui.loginBtn.text('Sign in');
        };
      })(this));
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

  })(Ajency.RegionController);
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
  uploadTemplate = '<img src="{{sizes.thumbnail.url}}" width="100" height="100" class="img-responsive img-rounded" /> <input type="hidden" name="media_id" value="{{id}}"/> <input type="hidden" name="media_sizes" value="{{sizesToString}}"/> <div id="filelist">Your browser doesnt have Flash, Silverlight or HTML5 support.</div> <br /> <div id="container"> <a id="pickfiles" href="javascript:;">[Select file]</a> <a id="uploadfiles" href="javascript:;">[Upload file]</a> </div> <div class="file-error"></div> <br />';
  Ajency.UploadView = (function(_super) {
    __extends(UploadView, _super);

    function UploadView() {
      return UploadView.__super__.constructor.apply(this, arguments);
    }

    UploadView.prototype.template = Handlebars.compile(uploadTemplate);

    UploadView.prototype.ui = {
      fileError: '.file-error'
    };

    UploadView.prototype.initialize = function(opt) {
      return this.model = opt.model, opt;
    };

    UploadView.prototype.mixinTemplateHelpers = function(data) {
      data = UploadView.__super__.mixinTemplateHelpers.call(this, data);
      data.sizesToString = JSON.stringify(data.sizes);
      return data;
    };

    UploadView.prototype._pluploadHeaders = function() {
      var HTTP_X_API_KEY, HTTP_X_SHARED_SECRET, apiSignature, args, timeStamp;
      if (typeof WP_API_NONCE !== 'undefined') {
        return {
          'X-WP-Nonce': WP_API_NONCE
        };
      }
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
        'request_method': 'POST',
        'request_uri': ("" + APIURL + "/attachments").replace(window.location.origin, '')
      };
      apiSignature = CryptoJS.MD5(JSON.stringify(args) + HTTP_X_SHARED_SECRET);
      return {
        'HTTP_X_API_KEY': HTTP_X_API_KEY,
        'HTTP_X_API_TIMESTAMP': timeStamp,
        'HTTP_X_API_SIGNATURE': apiSignature.toString()
      };
    };

    UploadView.prototype.onShow = function() {
      this.uploaded = 0;
      this.uploader = new plupload.Uploader({
        runtimes: "gears,html5,flash,silverlight,browserplus",
        file_data_name: "async-upload",
        browse_button: "pickfiles",
        multiple_queues: true,
        multipart: true,
        urlstream_upload: true,
        max_file_size: "2mb",
        url: "" + APIURL + "/attachments",
        flash_swf_url: "" + _SITEURL + "/wp-includes/js/plupload/plupload.flash.swf",
        silverlight_xap_url: "" + _SITEURL + "/wp-includes/js/plupload/plupload.silverlight.xap",
        headers: this._pluploadHeaders(),
        filters: [
          {
            title: "Image files",
            extensions: "jpg,gif,png"
          }
        ],
        init: {
          PostInit: function(up) {
            document.getElementById("filelist").innerHTML = "";
            return document.getElementById("uploadfiles").onclick = function() {
              return up.start();
            };
          },
          FilesAdded: (function(_this) {
            return function(up, files) {
              _this.ui.fileError.html('');
              return plupload.each(files, function(file) {
                return document.getElementById("filelist").innerHTML += "<div id=\"" + file.id + "\">" + file.name + " (" + plupload.formatSize(file.size) + ") <b></b></div>";
              });
            };
          })(this),
          UploadProgress: function(up, file) {
            return document.getElementById(file.id).getElementsByTagName("b")[0].innerHTML = "<span>" + file.percent + "%</span>";
          },
          Error: (function(_this) {
            return function(up, err) {
              return _this.ui.fileError.html("\nError #" + err.code + ": " + err.message);
            };
          })(this),
          FileUploaded: (function(_this) {
            return function(up, file, response) {
              response = JSON.parse(response.response);
              _this.model.set(response);
              _this.$el.find('img').attr('src', _this.model.get('sizes')['thumbnail']['url']);
              _this.$el.find('input[name="media_id"]').val(_this.model.get('id'));
              return _this.$el.find('input[name="media_sizes"]').val(JSON.stringify(_this.model.get('sizes')));
            };
          })(this)
        }
      });
      return this.uploader.init();
    };

    UploadView.prototype.onClose = function() {
      return this.uploader.destroy();
    };

    return UploadView;

  })(Marionette.ItemView);
  Ajency.FileUploadCtrl = (function(_super) {
    __extends(FileUploadCtrl, _super);

    function FileUploadCtrl() {
      return FileUploadCtrl.__super__.constructor.apply(this, arguments);
    }

    FileUploadCtrl.prototype.initialize = function(opt) {
      var model;
      if (opt == null) {
        opt = {};
      }
      model = opt.model;
      return this.show(new Ajency.UploadView({
        model: model
      }));
    };

    return FileUploadCtrl;

  })(Marionette.RegionController);
  currentUserTemplate = '<div data-placement="bottom" data-toggle="popover" title="{{display_name}}" >&nbsp; {{display_name}} &nbsp;<img class="media-object dp img-rounded" src="{{profile_picture.sizes.thumbnail.url}}" style="width: 30px;height:30px;"></div> <div class="hidden popover-content"> <div class="text-center"> <img class="media-object dp img-rounded" src="{{profile_picture.sizes.thumbnail.url}}" style="width: 100px;height:100px;"> <button class="btn btn-small logout-button" >Logout</button> </div> </div>';
  Ajency.CurrentUserView = (function(_super) {
    __extends(CurrentUserView, _super);

    function CurrentUserView() {
      return CurrentUserView.__super__.constructor.apply(this, arguments);
    }

    CurrentUserView.prototype.template = Handlebars.compile(currentUserTemplate);

    CurrentUserView.prototype.modelEvents = {
      'change': 'render'
    };

    CurrentUserView.prototype.ui = {
      'logoutButton': '.logout-button'
    };

    CurrentUserView.prototype.events = {
      'click @ui.logoutButton': 'logoutApp'
    };

    CurrentUserView.prototype.logoutApp = function() {
      return currentUser.logout();
    };

    CurrentUserView.prototype.onRender = function() {
      var _content;
      _content = this.$el.find('.popover-content').html();
      return this.$el.find('[data-toggle="popover"]').popover({
        html: true,
        content: _content
      });
    };

    return CurrentUserView;

  })(Marionette.ItemView);
  return Ajency;
});
