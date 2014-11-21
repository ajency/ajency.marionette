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
      var cachedTemplate, possibleTemplateId, templateId;
      possibleTemplateId = template.indexOf('<') === -1;
      if (!possibleTemplateId || Backbone.$(possibleTemplateId).length === 0) {
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
  return Ajency;
});
