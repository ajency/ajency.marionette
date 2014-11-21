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

	authenticate : (args...)->
		deferred = new Marionette.Deferred()
		if @isLoggedIn()
			deferred.resolve true
			return deferred.promise()

		if _.isObject args[0]
			$.post "#{APIURL}/authenticate", args[0], ->
				deferred.resolve true

		if _.isString(args[0]) and args[0] is 'facebook'
			FB.login (response)->
				if response.authResponse
					FB.api '/me', (response)->
						data =
							type : 'facebook'
							user_email : response.email
						$.post "#{APIURL}/authenticate", data , ->
							deferred.resolve true

		deferred.promise()



# define the logged in user single ton
window.currentUser = new Ajency.CurrentUser

