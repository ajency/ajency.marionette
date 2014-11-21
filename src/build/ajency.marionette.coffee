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

	# @include ../templateCache.coffee
	# @include ../currentUser.coffee

	Ajency
