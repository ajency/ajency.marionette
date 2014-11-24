
# Login View
class LoginView extends Marionette.ItemView

	template : '#login-template'

	ui :
		'loginBtn' : '#btn-login'
		'fbLoginBtn' : '#btn-fblogin'
		'userLogin' : 'input[name="user_login"]'
		'userPass' : 'input[name="user_pass"]'

	events :
		'click @ui.fbLoginBtn' : 'loginWithFB'
		'click @ui.loginBtn' : 'loginDefault'

	initialize : (options = {})->
		@listenTo currentUser, 'user:auth:failed', (response)->
			@triggerMethod 'user:auth:failed', response

	loginWithFB : ->
			currentUser.authenticate 'facebook'

	loginDefault : ->
		data =
			user_name : @ui.userLogin.val()
			user_pass : @ui.userPass.val()
		currentUser.authenticate data


# Login controller
class Ajency.LoginCtrl extends Ajency.RegionController

	initialize : ->
		@_view  = new LoginView
		@show @_view
