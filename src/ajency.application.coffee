_.extend Marionette.Application::,

	initialize : (options = {})->
		@currentUser = currentUser

	appStates :
		'NothingFound' : url : '/*notFound'

	getCurrentRoute : ->
		Backbone.history.getFragment()

	state : (name, def = {})->
		@appStates[name] = def
		@

	_registerStates : ->
		Marionette.RegionControllers.prototype.controllers = @
		_.extend Marionette.AppStates::, appStates : @appStates
		@router = new Marionette.AppStates app : @

	start : (options = {})->
		@_detectRegions()
		@triggerMethod 'before:start', options
		@_registerStates()
		@_initCallbacks.run options, @
		@triggerMethod 'start', options
