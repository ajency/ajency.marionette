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
