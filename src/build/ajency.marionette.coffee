((root, factory) ->
	Backbone = undefined
	Marionette = undefined
	_ = undefined
	if typeof define is "function" and define.amd
		define [
			"backbone"
			"underscore"
			"backbone.marionette"
			"handlebars"
		], (Backbone, _, Marionette, Handlebars) ->
			root.Ajency = factory(root, Backbone, _, Marionette, Handlebars)

	else if typeof exports isnt "undefined"
		Backbone = require("backbone")
		_ = require("underscore")
		Marionette = require("backbone.marionette")
		Handlebars = require("handlebars")
		module.Ajency = factory(root, Backbone, _, Marionette, Handlebars)
	else
		root.Ajency = factory(root, root.Backbone, root._, root.Marionette, root.Handlebars)

) this, (root, Backbone, _, Marionette, Handlebars) ->
	"use strict"

	# the root object of the plugin
	Ajency = {}

	# @include ../ajency.application.coffee
	# @include ../ajency.templateCache.coffee
	# @include ../ajency.currentUser.coffee
	# @include ../ajency.noaccess.coffee
	# @include ../ajency.regionCtrl.coffee
	# @include ../ajency.loginCtrl.coffee

	Ajency
