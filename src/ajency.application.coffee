_.extend Marionette.Application::,

	appStates :
		'NothingFound' : url : '/*notFound'

	navigate : Backbone.Router::navigate

	state : (name, def = {})->
		@appStates[name] = def
		@

	_registerStates : ->
		Marionette.RegionControllers.prototype.controllers = @
		_.extend Marionette.AppStates::, appStates : @appStates
		new Marionette.AppStates app : @

	start : (options = {})->
		@currentUser = window.currentUser
		@_detectRegions()
		@_registerStates()
		@triggerMethod 'before:start', options
		@_initCallbacks.run options, @
		@triggerMethod 'start', options

	controller : (name, ctrlPrototype)->
		if _.isFunction ctrlPrototype
			CtrlClass = ctrlPrototype
		else
			class CtrlClass extends Ajency.RegionController
			_.extend CtrlClass::, ctrlPrototype

		@[name] = CtrlClass
		@

