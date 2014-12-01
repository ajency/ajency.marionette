# Region controller

class Ajency.RegionController extends Marionette.RegionController

	constructor : (options = {})->
		if not options.region or ( options.region instanceof Marionette.Region isnt true )
			throw new Marionette.Error
				message: 'Region instance is not passed'

		@_ctrlID = _.uniqueId 'ctrl-'
		@_region = options.region

		hasAccess = @confirmAccess options.stateName
		if hasAccess isnt true
			capName = "access_#{options.stateName}"
			type = 'noaccess'
			@showNoAccessView type
			return

		super options

	showNoAccessView : ->
		@_view = new Ajency.NoAccessView type : 'type1'
		@listenTo @_view, 'show', =>
							_.delay =>
								@trigger 'view:rendered', @_view
							, 100
		@show @_view


	confirmAccess : (stateName)->
		currentUser = window.currentUser
		currentUser.hasCap "access_#{stateName}"

	_getNoAccessType : ->
		return 'notdefined'

