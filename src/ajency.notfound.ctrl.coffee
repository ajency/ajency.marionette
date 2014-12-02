# Login View
class NothingFoundView extends Marionette.ItemView
	template : '#404-template'

# Login controller
class Ajency.NothingFoundCtrl extends Marionette.RegionController
	initialize : ->
		@show new NothingFoundView
