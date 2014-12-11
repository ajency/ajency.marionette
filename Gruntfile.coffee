
_ = require 'underscore'

module.exports = (grunt) ->

	require("load-grunt-tasks") grunt

	grunt.initConfig

		preprocess :
			build:
				src: "src/build/ajency.marionette.coffee"
				dest: "tmp/ajency.marionette.coffee"
			specs :
				src : [ "spec/ajency.marionette.specs.coffee" ]
				dest : "tmp/ajency.marionette.specs.coffee"


		# produce index.html by target
		coffee :
			options :
				bare : true
			compile :
				files :
					"tmp/ajency.marionette.js" : "tmp/ajency.marionette.coffee"
					"tmp/ajency.marionette.specs.js" : "tmp/ajency.marionette.specs.coffee"
			distribution :
				files :
					"dist/ajency.marionette.js" : "tmp/ajency.marionette.coffee"

		jasmine:
			test:
				options:
					specs: 'tmp/ajency.marionette.specs.js'
				src: [
					'bower_components/underscore/underscore.js'
					'bower_components/jquery/dist/jquery.js'
					'bower_components/backbone/backbone.js'
					'bower_components/jQuery-Storage-API/jquery.storageapi.js'
					'bower_components/backbone.marionette/lib/backbone.marionette.js'
					'bower_components/marionette.state/dist/marionette.state.js'
					'bower_components/handlebars/handlebars.js'
					'bower_components/jasmine-jquery/lib/jasmine-jquery.js'
					'bower_components/jasmine-ajax/lib/mock-ajax.js'
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
				tasks: ["preprocess:build","coffee:compile"]


	grunt.registerTask "dev","Start development", [
		"preprocess"
		"coffee:compile"
		#"jasmine:test"
		"watch"
	]

	grunt.registerTask "dist", "Create distribution build", [
		"preprocess"
		"coffee:compile"
		#"jasmine:test"
		"coffee:distribution"
	]

