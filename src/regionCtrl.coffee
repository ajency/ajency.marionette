# Region controller

class Ajency.RegionController extends Marionette.Controller

	constructor: (options = {}) ->

		if not options.region or ( options.region instanceof Marionette.Region isnt true )
			throw new Marionette.Error
				message: 'region instance is not passed'

		@_ctrlID = _.uniqueId "ctrl-"
		@_region = options.region

		# call parent constructor
		super options

	show : (view)->

		if view instanceof Backbone.View isnt true
			throw new Marionette.Error
				message: 'view instance is not passed'

		@_region.show view
