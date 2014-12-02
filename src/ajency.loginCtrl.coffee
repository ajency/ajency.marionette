# Login View
class Ajency.LoginView extends Marionette.ItemView

	template : '#login-template'

	ui :
		'loginBtn' : '#btn-login'
		'fbLoginBtn' : '#btn-fblogin'
		'userLogin' : 'input[name="user_login"]'
		'userPass' : 'input[name="user_pass"]'

	events :
		'click @ui.loginBtn' : 'loginDefault'

	initialize : (options = {})->
		@listenTo currentUser, 'user:auth:failed', (response)->
			@triggerMethod 'user:auth:failed', response

	loginDefault : ->
		data =
			user_login : @ui.userLogin.val()
			user_pass : @ui.userPass.val()
		currentUser.authenticate data


# Login controller
class Ajency.LoginCtrl extends Ajency.RegionController

	initialize : ->
		@_view  = new Ajency.LoginView
		@show @_view
