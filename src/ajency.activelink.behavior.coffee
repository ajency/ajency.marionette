###
# Ajency.ActiveLinkBehavior
###
class Ajency.ActiveLinkBehavior extends Marionette.Behavior

	defaults : ->
		app : false

	events :
		'click @ui.ul li' : 'setActiveLink'

	setActiveLink : (evt)->
		$(evt.currentTarget).siblings().removeClass 'active'
		$(evt.currentTarget).addClass 'active'

