# mock FB API
window.FB =
	login : ->
	api : (url, cb)->
		cb email : 'someemail@mail.com'

# define API URL
window.APIURL = 'http://localhost/project/wp-api'

# set the current user
setCurrentUser = ->
	userData =
		ID : 1
		user_name : 'admin'
		user_email : 'admin@mailinator.com'
		caps :
			edit_post : true
			read_others_post : false

	window.currentUser.set userData

# reset the current user
clearCurrentUser = ->
	window.currentUser.clear()

beforeEach ->
	this.setFixtures   = setFixtures
	this.loadFixtures  = loadFixtures

afterEach ->
	window.location.hash = ''
	Backbone.history.stop()
	Backbone.history.handlers.length = 0
