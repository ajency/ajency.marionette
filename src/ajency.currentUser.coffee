# Class : Ajency.CurrentUser
# Identifies current logged in user. Even if the
# user is not loggedin, currentUser variable will
# be accessible through window.currentUser
# API:
#  - isLoggedIn()
#  - hasCap()

class CurrentUser extends Backbone.Model

	defaults : ->
		return {}

	initialize : (opt)->
		if currentUserNS.localStorage.isSet 'userModel'
			@set currentUserNS.localStorage.get 'userModel'

	isLoggedIn : ->
		authNS.localStorage.isSet 'HTTP_X_API_KEY'

	hasCap : (capName = '')->
		if not @has('caps') then return false
		caps = @get 'caps'
		if _.isObject(caps) and not _.isUndefined(caps[capName]) and caps[capName] is true
			return true
		return false

	capExists : (capName)->
		if not @has('caps') then return false
		caps = @get 'caps'
		if not _.isUndefined(caps[capName])
			return true
		return false

	authenticate : (args...)->
		_currentUser = @

		if @isLoggedIn() then return
		_this = @
		if _.isObject args[0]
			responseFn = (response)->
				if _.isUndefined(response.ID)
					_currentUser.trigger 'user:auth:failed', response
					_this.trigger 'user:auth:failed', response
				else
					authNS.localStorage.set 'HTTP_X_API_KEY', xhr.getResponseHeader 'HTTP_X_API_KEY'
					authNS.localStorage.set 'HTTP_X_SHARED_SECRET', xhr.getResponseHeader 'HTTP_X_SHARED_SECRET'
					currentUserNS.localStorage.set 'userModel', response
					_currentUser.set response
					_currentUser.trigger 'user:auth:success', _currentUser

			$.post "#{APIURL}/authenticate", args[0], responseFn, 'json'

# define the logged in user singleton
currentUser = new CurrentUser

jQuery.ajaxSetup
	beforeSend: (xhr, settings)->

		if !authNS.localStorage.isSet 'HTTP_X_API_KEY'
			return

		apiSignature = ''
		timeStamp = _.now()
		HTTP_X_API_KEY = authNS.localStorage.get 'HTTP_X_API_KEY'
		HTTP_X_SHARED_SECRET = authNS.localStorage.get 'HTTP_X_SHARED_SECRET'

		args =
			'api_key' : HTTP_X_API_KEY
			'timestamp' : timeStamp + ''
			'request_method' : settings.type
			'request_uri' : settings.url.replace window.location.origin,''

		apiSignature = CryptoJS.MD5 JSON.stringify(args) + HTTP_X_SHARED_SECRET

		xhr.setRequestHeader 'HTTP_X_API_KEY', HTTP_X_API_KEY
		xhr.setRequestHeader 'HTTP_X_API_TIMESTAMP', timeStamp
		xhr.setRequestHeader 'HTTP_X_API_SIGNATURE', apiSignature