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
  _.extend(Marionette.TemplateCache.prototype, {
    compileTemplate: function(rawTemplate) {
      return Mustache.compile(rawTemplate);
    }
  });
  return Ajency;
});
