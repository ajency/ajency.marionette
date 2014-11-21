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

	# change the HTML templating to mustache instead of underscore
	
	Mustache.compile = (template)->
	
		# This operation parses the template and caches
		# the resulting token tree. All future calls to
		# mustache.render can now skip the parsing step.
		Mustache.parse template
	
		(view, partials)->
			Mustache.render template, view, partials
	
	
	# Use Mustache instead of underscore templating
	_.extend Marionette.TemplateCache::,
	
		compileTemplate : (rawTemplate)->
			Mustache.compile rawTemplate
	

	Ajency
