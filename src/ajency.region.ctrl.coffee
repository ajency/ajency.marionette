# Region controller

class Ajency.NoAccessView extends Marionette.ItemView
	template : '#no-access-template'

	initialize : (options = {})->
		{@type} = options

	mixinTemplateHelpers : (data)->
		data = super data
		data[@type] = true
		data

class Ajency.RegionController extends Marionette.RegionController

	constructor : (options = {})->

		if not options.region or ( options.region instanceof Marionette.Region isnt true )
			throw new Marionette.Error
				message: 'Region instance is not passed'

		@_ctrlID = _.uniqueId 'ctrl-'
		@_region = options.region

		capName = "access_#{options.stateName}"
		if window.currentUser.hasCap capName
			super options
		else
			@_showNoAccessView capName


	_showNoAccessView : (capName)->
		_type = @_getNoAccessType capName
		@show new Ajency.NoAccessView type : _type

	_getNoAccessType : (capName)->
		if not window.currentUser.capExists capName
			_type = 'not_defined'
		else if window.currentUser.capExists(capName) and not window.currentUser.isLoggedIn()
			_type = 'no_access_login'
		else
			_type = 'no_access'
		_type

