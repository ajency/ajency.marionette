# Use Handlebars instead of underscore templating
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
		Handlebars.compile rawTemplate
