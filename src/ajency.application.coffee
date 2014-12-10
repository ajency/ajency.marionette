_.extend Marionette.Application::,

	appStates :
		'NothingFound' : url : '/*notFound'

	navigate : Backbone.Router::navigate

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
		@_registerStates()
		@triggerMethod 'before:start', options
		@_initCallbacks.run options, @
		@triggerMethod 'start', options
