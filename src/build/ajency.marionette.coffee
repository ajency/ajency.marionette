###
#
# Ajency.Marionette
# https://github.com/ajency/ajency.marionette/wiki
# --------------------------------------------------
# Version: v0.3.9
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
			"jquery"
			"backbone"
			"underscore"
			"backbone.marionette"
			"handlebars"
		], ($, Backbone, _, Marionette, Handlebars) ->
			root.Ajency = factory(root,$, Backbone, _, Marionette, Handlebars)

	else if typeof exports isnt "undefined"
		$ = require("jquery")
		Backbone = require("backbone")
		_ = require("underscore")
		Marionette = require("backbone.marionette")
		Handlebars = require("handlebars")
		module.Ajency = factory(root, $, Backbone, _, Marionette, Handlebars)
	else
		root.Ajency = factory(root, root.$, root.Backbone, root._, root.Marionette, root.Handlebars)

) this, (root, $, Backbone, _, Marionette, Handlebars) ->
	"use strict"

	# the root object of the plugin
	Ajency = {}

	#local storage
	authNS = $.initNamespaceStorage 'auth'
	currentUserNS = $.initNamespaceStorage 'currentUser'

	# @include ../cordova.facebook.coffee
	# @include ../ajency.templateCache.coffee
	# @include ../ajency.currentUser.coffee
	# @include ../ajency.application.coffee

	# @include ../ajency.activelink.behavior.coffee
	# @include ../ajency.form.behavior.coffee

	# @include ../ajency.region.ctrl.coffee
	# @include ../ajency.login.ctrl.coffee
	# @include ../ajency.notfound.ctrl.coffee
	# @include ../ajency.fileuploader.ctrl.coffee
	# @include ../currentUser.view.coffee

	Ajency
