# Generated on 2014-08-22 using generator-angular 0.9.5
"use strict"

_ = require "lodash"
fs = require "fs"

# # Globbing
module.exports = (grunt)->

	# Load grunt tasks automatically
	require("load-grunt-tasks") grunt

	_gruntConfig =
			projectDir : ''

	# Time how long tasks take. Can help when optimizing build times
	# require("time-grunt") grunt

	# Define the configuration for all the tasks
	grunt.initConfig

		gruntConfig : _gruntConfig

		less :
			develop :
				files:
					"./css/style-responsive.css" : ["./css/less/style-responsive.less"]

		'html-prettyprinter' :
			compiled :
				src : "./index.html"
				dest : "./index.html"

		#may be later for beautifying all compiled html files
		'html-prettyprinter-dir':
			templates :
				src: ["./templates/*.html"]
				dest : "./templates/"

		watch:
			options:
				livereload: true
				spawn: false
				interrupt: true
			develop:
				files: [
					"./templates/*.html"
					"./css/less/*.less"
					"./js/coffee/*.coffee"
				]
				tasks: ["nunjucks:develop", "less:develop", "coffee:develop", "html-prettyprinter:compiled"]

		nunjucks :
			options:
				data : {}
				paths : "./templates"
			develop :
				files : [
					(
						expand: true
						cwd: "./templates"
						src: "index.html"
						dest: "./"
						ext: ".html"
					)
				]

		coffee :
			options:
				bare : true
				sourceMap: false
			develop:
				files :
					"./js/scripts.js" : "./js/coffee/scripts.coffee"


		connect:
			server:
				options:
					hostname: "localhost"
					open: true
					useAvailablePort: true
					livereload: true
					middleware: (connect) ->
						[
							connect.static("./")
							connect.static("../tmp/")
						]


	grunt.registerTask "dev", "Start develop", (target)->
		grunt.task.run [
				"less:develop"
				"coffee:develop"
				"nunjucks:develop"
				"html-prettyprinter:compiled"
				"connect"
				"watch:develop"
			]
