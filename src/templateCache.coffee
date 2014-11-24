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
		templateId = template.substr(template.length - 8) is 'template'
		if not templateId
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
