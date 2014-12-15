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
		if not _.isFbDefined()
			throw new Marionette.Error 'Please add facebook SDK'

		_scope = @ui.fbLoginButton.attr 'fb-scope'
		_scope = if not _.isString(_scope) then '' else _scope
		FB.login @_fbLoginHandler, scope: _scope

	_fbLoginHandler : (response)=>

		if response.authResponse
			FB.api '/me', (user)=>
				@triggerMethod 'facebook:login:success', user, response.authResponse.accessToken
		else
			@triggerMethod 'facebook:login:cancel'

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


