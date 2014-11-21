((root, factory) ->
	Backbone = undefined
	Marionette = undefined
	_ = undefined
	if typeof define is "function" and define.amd
		define [
			"backbone"
			"underscore"
			"backbone.marionette"
			"mustache"
		], (Backbone, _) ->
			root.Ajency = factory(root, Backbone, _)

	else if typeof exports isnt "undefined"
		Backbone = require("backbone")
		_ = require("underscore")
		Marionette = require("backbone.marionette")
		Mustache = require("mustache")
		module.Ajency = factory(root, Backbone, _, Marionette, Mustache)
	else
		root.Ajency = factory(root, root.Backbone, root._, root.Marionette, root.Mustache)

) this, (root, Backbone, _, Marionette, Mustache) ->
	"use strict"

	# the root object of the plugin
	Ajency = {}

	# Compile function for Mustache.js
	# Copied from https://github.com/janl/mustache.js/issues/346#issuecomment-29764332
	Mustache.compile = (template)->
		# This operation parses the template and caches
		# the resulting token tree. All future calls to
		# Mustache.render can now skip the parsing step.
		Mustache.parse template
	
		(view, partials)->
			Mustache.render template, view, partials
	
	
	# Use Mustache instead of underscore templating
	# Overridden the compileTemplate function
	
	_.extend Marionette.TemplateCache,
	
		get : (template)->
			possibleTemplateId = template.indexOf('<') is -1
			if not possibleTemplateId or Backbone.$(possibleTemplateId).length is 0
				return Marionette.TemplateCache::nonScriptTemplate template
	
			templateId = template
			cachedTemplate = @templateCaches[templateId];
			if not cachedTemplate
				cachedTemplate = new Marionette.TemplateCache templateId
				@templateCaches[templateId] = cachedTemplate
	
			cachedTemplate.load()
	
	_.extend Marionette.TemplateCache::,
	
		nonScriptTemplate : (template)->
			@compileTemplate template
	
		compileTemplate : (rawTemplate)->
			Mustache.compile rawTemplate
	

	Ajency
