_.extend Marionette.Application::,

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
		@currentUser = currentUser
		@_detectRegions()
		@triggerMethod 'before:start', options
		@_registerStates()
		@_initCallbacks.run options, @
		@triggerMethod 'start', options
