# Login View
class Ajency.LoginView extends Marionette.ItemView
	template : '#login-template'
	ui :
		'loginBtn' : '.aj-login-button'
		'fbLoginButton' : '.aj-fb-login-button'
		'userLogin' : 'input[name="user_login"]'
		'userPass' : 'input[name="user_pass"]'

	events :
		'click @ui.loginBtn' : 'loginDefault'
		'click @ui.fbLoginButton' : 'loginWithFacebook'

	initialize : (options = {})->
		@listenTo currentUser, 'user:auth:failed', (response)->
			@triggerMethod 'user:auth:failed', response

	loginWithFacebook : (evt)=>
		_scope = @ui.fbLoginButton.attr 'fb-scope'
		_scope = if not _.isString(_scope) then '' else _scope
		facebookConnectPlugin.getLoginStatus (resp)=>
			if resp.status isnt 'connected'
				facebookConnectPlugin.login _scope, @_fbLoginHandler
			else
				@_fbLoginSuccess()

	_fbLoginHandler : (response)=>
		if response.authResponse
			@_fbLoginSuccess()
		else
			@triggerMethod 'facebook:login:cancel'

	_fbLoginSuccess : =>
		facebookConnectPlugin.api '/me',[], (user)=>
			facebookConnectPlugin.getAccessToken (token)=>
				@trigger 'facebook:login:success', user, token

	loginDefault : ->
		data =
			user_login : @ui.userLogin.val()
			user_pass : @ui.userPass.val()
		currentUser.authenticate data


# Login controller
class Ajency.LoginCtrl extends Marionette.RegionController
	initialize : ->
		loginView = new Ajency.LoginView
		@listenTo loginView, 'facebook:login:success', @_facebookAuthSuccess
		@listenTo loginView, 'facebook:login:cancel', @_facebookAuthCancel
		@show loginView

	_facebookAuthSuccess : (args...)->
		currentUser.authenticate 'facebook', args...

	_facebookAuthCancel : ->
		currentUser.trigger 'user:auth:cancel'


