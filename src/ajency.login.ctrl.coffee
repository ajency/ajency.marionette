# Login View

loginViewTemplate = '<div class="container-fluid">
			<div class="row">
				<div class="col-md-12">
					<h3 class="special brand text-center m-b-50 m-t-5">Sign In</h3>
					<div class="response-message"></div>
					<div class="form-group fly-group m-t-20">
						<label class="fly-label classic">Username</label>
							<input type="text" required name="user_login" id="user_login" class="srch-filters form-control" placeholder="Username" aria-label="Username">         
							<span class="fa fa-user form-control-feedback" aria-hidden="true"></span>
					</div>
					<div class="form-group fly-group m-t-30">
						<label class="fly-label classic">Password</label>
						<input type="password" required name="user_pass" id="user_pass" class="srch-filters form-control" placeholder="Password" aria-label="Password">         
						<span class="fa fa-lock form-control-feedback" aria-hidden="true"></span>
					</div>
					<button type="button" class="btn btn-primary btn-block raised aj-submit-button aj-login-button m-t-40 m-b-20">SIGN IN</button>
				</div>
			</div>
		</div>'

class Ajency.LoginView extends Marionette.ItemView
	tagName : 'form'
	template : Handlebars.compile loginViewTemplate
	ui :
		'responseMessage' : '.response-message'
		'loginBtn' : '.aj-submit-button'
		'fbLoginButton' : '.aj-fb-login-button'
		'userLogin' : 'input[name="user_login"]'
		'userPass' : 'input[name="user_pass"]'
	events :
		'click @ui.loginBtn' : 'loginDefault'
		'click @ui.fbLoginButton' : 'loginWithFacebook'

	behaviors : 
		FormBehavior : 
			behaviorClass : Ajency.FormBehavior

	initialize : (options = {})->
		@listenTo currentUser, 'user:auth:failed', (response)->
			@triggerMethod 'user:auth:failed', response

	loginWithFacebook : (evt)=>
		$(evt.target).text 'Logging in... Please Wait...'
		_scope = @_getScope()
		facebookConnectPlugin.getLoginStatus (resp)=>
			if resp.status isnt 'connected'
				facebookConnectPlugin.login _scope, @_fbSuccessLoginHandler, @_fbFailureLoginHandler 
			else
				@_fbLoginSuccess()

	_getScope : ->
		_scope = @ui.fbLoginButton.attr 'fb-scope'
		_scope = if not _.isString(_scope) then '' else _scope
		_scope = _scope.split ','
		_scope

	_fbSuccessLoginHandler : (response)=>
		if response.authResponse
			@_fbLoginSuccess()

	_fbFailureLoginHandler: =>
		@triggerMethod 'facebook:login:cancel'
		@ui.fbLoginButton.text 'Login with Facebook'
		@ui.fbLoginButton.after '<p class="text-center authentication-cancelled">Authentication cancelled by user</p>'

	_fbLoginSuccess : =>
		facebookConnectPlugin.api '/me',[], (user)=>
			facebookConnectPlugin.getAccessToken (token)=>
				@trigger 'facebook:login:success', user, token

	onFormSubmit : (data)->
		@$('.alert').empty().removeClass 'alert alert-danger'
		@ui.loginBtn.text 'Signing in... Please Wait...'
		data =
			user_login : @ui.userLogin.val()
			user_pass : @ui.userPass.val()
		currentUser.authenticate(data).done (response)=>
			if _.isUndefined(response.ID)
				@triggerMethod 'basic:login:failure', response
				failMessage = response[0].message
				@ui.responseMessage.addClass('alert alert-danger').html failMessage
				@ui.loginBtn.text 'Sign in'
		.fail (args...)=>
			failMessage = 'Request failed. Please try again'
			@ui.responseMessage.addClass('alert alert-danger').html failMessage
			@ui.loginBtn.text 'Sign in'


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


