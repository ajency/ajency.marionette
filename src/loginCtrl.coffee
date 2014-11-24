
# Login View
class LoginView extends Marionette.ItemView

	template : '#login-template'

	ui :
		'loginBtn' : '#btn-login'
		'fbLoginBtn' : '#btn-fblogin'

	events :
		'click @ui.fbLoginBtn' : 'loginWithFB'
		'click @ui.loginBtn' : 'loginDefault'

	initialize : (options = {})->
		@listenTo currentUser, 'user:auth:failed', (response)->
			@triggerMethod 'user:auth:failed', response

	loginWithFB : (options = {})->
		currentUser.authenticate 'facebook', options

	loginDefault : (options = {})->
		data =
			user_name : 'admin'
			user_pass : 'password'
		currentUser.authenticate data


# Login controller
class Ajency.LoginCtrl extends Ajency.RegionController

	initialize : ->
		@_view  = new LoginView
		@show @_view
