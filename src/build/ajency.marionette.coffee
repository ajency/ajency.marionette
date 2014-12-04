###
#
# Ajency.Marionette
# https://github.com/ajency/ajency.marionette/wiki
# --------------------------------------------------
# Version: v0.1.3
#
# Copyright(c) 2014 Team Ajency, Ajency.in
# Distributed under MIT license
#
###

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

	# @include ../ajency.templateCache.coffee
	# @include ../ajency.currentUser.coffee
	# @include ../ajency.application.coffee

	# @include ../ajency.activelink.behavior.coffee

	# @include ../ajency.region.ctrl.coffee
	# @include ../ajency.login.ctrl.coffee
	# @include ../ajency.notfound.ctrl.coffee

	Ajency
