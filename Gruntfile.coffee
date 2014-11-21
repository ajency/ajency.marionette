
_ = require 'underscore'

module.exports = (grunt) ->

	require("load-grunt-tasks") grunt

	grunt.initConfig

		preprocess :
			build:
				src: "src/build/ajency.marionette.coffee"
				dest: "tmp/ajency.marionette.coffee"
			specs :
				src : [ "spec/*.coffee" ]
				dest : "tmp/ajency.marionette.spec.coffee"


		# produce index.html by target
		coffee :
			options :
				bare : true
			compile :
				files :
					"tmp/ajency.marionette.js" : "tmp/ajency.marionette.coffee"
					"tmp/ajency.marionette.spec.js" : "tmp/ajency.marionette.spec.coffee"

		jasmine:
			test:
				options:
					specs: 'tmp/ajency.marionette.spec.js'
				src: [
					'bower_components/underscore/underscore.js'
					'bower_components/jquery/dist/jquery.js'
					'bower_components/backbone/backbone.js'
					'bower_components/backbone.marionette/lib/backbone.marionette.js'
					'bower_components/mustache/mustache.js'
					'bower_components/jasmine-jquery/lib/jasmine-jquery.js'
					'tmp/ajency.marionette.js'
				]

		watch:
			options:
				spawn: false
				interrupt: true
			source:
				files: [
					"src/**/*.coffee"
					"spec/**/*.coffee"
				]
				tasks: ["preprocess:build","preprocess:specs","coffee:compile", "jasmine:test"]



	grunt.registerTask "dev","Start development", [
		"preprocess"
		"coffee"
		"jasmine:test"
		"watch"
	]
