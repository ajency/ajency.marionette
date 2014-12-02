# Class : Ajency.CurrentUser
# Identifies current logged in user. Even if the
# user is not loggedin, currentUser variable will
# be accessible through window.currentUser
# API:
#  - isLoggedIn()
#  - hasCap()

class Ajency.CurrentUser extends Backbone.Model

	defaults : ->
		return {}

	isLoggedIn : ->
		@has('ID') and @get('ID') > 0

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

		if _.isObject args[0]
			responseFn = (response)->
				if not _.isUndefined(response.error) and response.error is true
					_currentUser.trigger 'user:auth:failed', response
				else
					_currentUser.set response
					_currentUser.trigger 'user:auth:success', _currentUser

			$.post "#{APIURL}/authenticate", args[0], responseFn, 'json'

# define the logged in user single ton
window.currentUser = new Ajency.CurrentUser

