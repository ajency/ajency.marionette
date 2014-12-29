# Class : Ajency.CurrentUser
# Identifies current logged in user. Even if the
# user is not loggedin, currentUser variable will
# be accessible through window.currentUser
# API:
#  - isLoggedIn()
#  - hasCap()

window.notLoggedInCaps = window.notLoggedInCaps or {}
window.allSystemCaps = window.allSystemCaps or []

Ajency.notLoggedInCapExists = (capName)->
	if not _.isObject window.notLoggedInCaps
		return false

	if not window.notLoggedInCaps[capName]
		return false

	return true


Ajency.allSystemCapExists = (capName)->
	_.indexOf(window.allSystemCaps, capName) isnt -1

class Ajency.CurrentUser extends Backbone.Model

	idAttribute : 'ID'

	defaults : ->
		caps : {}

	isLoggedIn : ->
		@isNew() is false

	logout : ->
		@clear slient : true
		authNS.localStorage.removeAll()
		@trigger 'user:logged:out'
		@setNotLoggedInCapabilities()

	setNotLoggedInCapabilities  : ->
		@set 'caps', window.notLoggedInCaps

	hasCap : (capName = '')->
		if not @has('caps') then return false
		caps = @get 'caps'
		if _.isObject(caps) and not _.isUndefined(caps[capName]) and caps[capName] is true
			return true
		return false

	capExists : (capName)->
		if not @has('caps') then return false
		caps = @get 'caps'
		if not _.isUndefined caps[capName]
			return true
		return false

	getFacebookPicture : ->
		facebookConnectPlugin.api "/me/picture?width=200",[], @_setProfilePicture

	_setProfilePicture : (resp)=>
		if resp and not resp.error
			_picture =
				'id' : 0
				'sizes' :
					"thumbnail" :
						"height" : 150
						"width" : 150
						"url" : resp.data.url

			@set 'profile_picture',_picture

	authenticate : (args...)->
		_currentUser = this
		_this = this
		responseFn = (response, status, xhr) ->
			if _.isUndefined(response.ID)
				_currentUser.trigger "user:auth:failed", response
				_this.trigger "user:auth:failed", response
			else
				authNS.localStorage.set "HTTP_X_API_KEY", xhr.getResponseHeader("HTTP_X_API_KEY")
				authNS.localStorage.set "HTTP_X_SHARED_SECRET", xhr.getResponseHeader("HTTP_X_SHARED_SECRET")
				_currentUser.set response
				_currentUser.trigger "user:auth:success", _currentUser

		if _.isString(args[0])
			userData = args[1]
			accessToken = args[2]
			userLogin = "FB_" + userData.id
			data =
				user_login: userLogin
				user_pass: accessToken
				type: "facebook"
				userData: userData

			xhr = $.post "" + APIURL + "/authenticate", data, responseFn, "json"
		else if _.isObject(args[0])
			xhr = $.post "" + APIURL + "/authenticate", args[0], responseFn, "json"

		xhr


# define the logged in user singleton
currentUser = new Ajency.CurrentUser

jQuery.ajaxSetup
	beforeSend: (xhr, settings)->

		if typeof WP_API_NONCE isnt 'undefined'
			xhr.setRequestHeader 'X-WP-Nonce', WP_API_NONCE
			return

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
