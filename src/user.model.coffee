
class Ajency.LoggedInUser extends Backbone.Model

	# initialize
	initialize : ->


	# Import the `triggerMethod` to trigger events with corresponding
	# methods if the method exists
	triggerMethod: Marionette.triggerMethod

	# Proxy `getOption` to enable getting options from this or this.options by name.
	getOption: Marionette.proxyGetOption

	# Proxy `unbindEntityEvents` to enable binding view's events from another entity.
	bindEntityEvents: Marionette.proxyBindEntityEvents

	# Proxy `unbindEntityEvents` to enable unbinding view's events from another entity.
	unbindEntityEvents: Marionette.proxyUnbindEntityEvents
