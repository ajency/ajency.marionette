
currentUserTemplate = '<div data-placement="bottom" data-toggle="popover" title="{{display_name}}" >&nbsp; {{display_name}} &nbsp;<img class="media-object dp img-rounded" src="{{profile_picture.sizes.thumbnail.url}}" style="width: 30px;height:30px;"></div>
                <div class="hidden popover-content">
                    <div class="text-center">
                        <img class="media-object dp img-rounded" src="{{profile_picture.sizes.thumbnail.url}}" style="width: 100px;height:100px;">
                        <button class="btn btn-small logout-button" >Logout</button>
                    </div>
                </div>'

class Ajency.CurrentUserView extends Marionette.ItemView
	template : Handlebars.compile currentUserTemplate
	modelEvents :
		'change' : 'render'
	ui :
		'logoutButton' : '.logout-button'
	events :
		'click @ui.logoutButton' : 'logoutApp'

	logoutApp : ->
		currentUser.logout()

	onRender : ->
		_content = @$el.find('.popover-content').html()
		@$el.find('[data-toggle="popover"]').popover html : true, content : _content
