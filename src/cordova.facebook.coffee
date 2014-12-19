#
# * @author Ally Ogilvie
# * @copyright Wizcorp Inc. [ Incorporated Wizards ] 2014
# * @file - facebookConnectPlugin.js
# * @about - JavaScript interface for PhoneGap bridge to Facebook Connect SDK
# *
# *
#
unless window.cordova

	# This should override the existing facebookConnectPlugin object created from cordova_plugins.js
	window.facebookConnectPlugin =
		getLoginStatus: (s, f) ->

			# Try will catch errors when SDK has not been init
			try
				FB.getLoginStatus (response) ->
					s response
					return

			catch error
				unless f
					console.error error.message
				else
					f error.message
			return

		showDialog: (options, s, f) ->
			options.name = ""    unless options.name
			options.message = ""    unless options.message
			options.caption = ""    unless options.caption
			options.description = ""    unless options.description
			options.href = ""    unless options.href
			options.picture = ""    unless options.picture

			# Try will catch errors when SDK has not been init
			try
				FB.ui options, (response) ->
					if response and (response.request or not response.error_code)
						s response
					else
						f response
					return

			catch error
				unless f
					console.error error.message
				else
					f error.message
			return


		# Attach this to a UI element, this requires user interaction.
		login: (permissions, s, f) ->

			# JS SDK takes an object here but the native SDKs use array.
			permissionObj = {}
			permissionObj.scope = permissions.toString()    if permissions and permissions.length > 0
			FB.login ((response) ->
				if response.authResponse
					s response
				else
					f response.status
				return
			), permissionObj
			return

		getAccessToken: (s, f) ->
			response = FB.getAccessToken()
			unless response
				unless f
					console.error "NO_TOKEN"
				else
					f "NO_TOKEN"
			else
				s response
			return

		logEvent: (eventName, params, valueToSum, s, f) ->

			# AppEvents are not avaliable in JS.
			s()
			return

		logPurchase: (value, currency, s, f) ->

			# AppEvents are not avaliable in JS.
			s()
			return

		logout: (s, f) ->

			# Try will catch errors when SDK has not been init
			try
				FB.logout (response) ->
					s response
					return

			catch error
				unless f
					console.error error.message
				else
					f error.message
			return

		api: (graphPath, permissions, s, f) ->

			# JS API does not take additional permissions

			# Try will catch errors when SDK has not been init
			try
				FB.api graphPath, (response) ->
					if response.error
						f response
					else
						s response
					return

			catch error
				unless f
					console.error error.message
				else
					f error.message
			return


		# Browser wrapper API ONLY
		browserInit: (app, appId, version='v2.2') ->
			window.fbAsyncInit = ->
				FB.init
					appId: appId
					cookie: true
					xfbml: true
					version: version

				FB.getLoginStatus (response) ->
					if response.status is "connected"
						app.trigger 'fb:status:connected'



	# Bake in the JS SDK
	(->
		if not window.FB and $("#fb-root").length > 0
			console.log "launching FB SDK"
			e = document.createElement("script")
			e.src = document.location.protocol + "//connect.facebook.net/en_US/sdk.js"
			e.async = true
			document.getElementById("fb-root").appendChild e
		return
	)()
