var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

(function(root, factory) {
  var Backbone, Marionette, Mustache, _;
  Backbone = void 0;
  Marionette = void 0;
  _ = void 0;
  if (typeof define === "function" && define.amd) {
    return define(["backbone", "underscore", "backbone.marionette", "mustache"], function(Backbone, _) {
      return root.Ajency = factory(root, Backbone, _);
    });
  } else if (typeof exports !== "undefined") {
    Backbone = require("backbone");
    _ = require("underscore");
    Marionette = require("backbone.marionette");
    Mustache = require("mustache");
    return module.Ajency = factory(root, Backbone, _, Marionette, Mustache);
  } else {
    return root.Ajency = factory(root, root.Backbone, root._, root.Marionette, root.Mustache);
  }
})(this, function(root, Backbone, _, Marionette, Mustache) {
  "use strict";
  var Ajency;
  Ajency = {};
  Mustache.compile = function(template) {
    Mustache.parse(template);
    return function(view, partials) {
      return Mustache.render(template, view, partials);
    };
  };
  _.extend(Marionette.TemplateCache, {
    get: function(template) {
      var cachedTemplate, mayBeTemplateId, templateId;
      mayBeTemplateId = template.indexOf('<') === -1;
      if (!mayBeTemplateId || Backbone.$(template).length === 0) {
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
      return Mustache.compile(rawTemplate);
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
      var args, deferred;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      deferred = new Marionette.Deferred();
      if (this.isLoggedIn()) {
        deferred.resolve(true);
        return deferred.promise();
      }
      if (_.isObject(args[0])) {
        $.post("" + APIURL + "/authenticate", args[0], function() {
          return deferred.resolve(true);
        });
      }
      if (_.isString(args[0]) && args[0] === 'facebook') {
        FB.login(function(response) {
          if (response.authResponse) {
            return FB.api('/me', function(response) {
              var data;
              data = {
                type: 'facebook',
                user_email: response.email
              };
              return $.post("" + APIURL + "/authenticate", data, function() {
                return deferred.resolve(true);
              });
            });
          }
        });
      }
      return deferred.promise();
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
  return Ajency;
});
