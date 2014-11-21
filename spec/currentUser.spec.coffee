describe "Current User", ->

	it 'currentUser must be defined', ->
		expect window.currentUser
			.toBeDefined()

	describe 'when user is not logged in', ->
		it 'logged in status must be false ', ->
			expect currentUser.isLoggedIn()
				.toBe false

	describe 'when user is logged in', ->

		beforeEach ->
			userData =
				ID : 1
				user_name : 'admin'
				user_email : 'admin@mailinator.com'
			window.currentUser.set userData

		afterEach ->
			window.currentUser.clear()

		it 'logged in status must be true', ->
			expect currentUser.isLoggedIn()
				.toBe true


	describe "Current user role & capabilites", ->

		beforeEach ->
			userData =
				ID : 1
				user_name : 'admin'
				user_email : 'admin@mailinator.com'
				caps :
					edit_post : true
					read_others_post : false

			currentUser.set userData

		afterEach ->
			currentUser.clear()

		it 'must check if user has the capability', ->
			expect currentUser.hasCap 'edit_post'
				.toBe true
			expect currentUser.hasCap 'delete_post'
				.toBe false
			expect currentUser.hasCap 'read_others_post'
				.toBe false

		it 'must return false for not logged in user', ->
			currentUser.clear() # logout user
			expect currentUser.hasCap 'edit_post'
				.toBe false


	describe 'Current user authentication', ->

		beforeEach ->
			jasmine.Ajax.install()

		afterEach ->
			clearCurrentUser()

		it 'must resolve with true if already logged in', (done)->
			setCurrentUser()
			details = user_name : 'admin', user_pass : 'pass'
			deferred =  currentUser.authenticate details
			deferred.done (response)->
				expect response
					.toBe true
				done()

		describe 'username/password login', ->
			beforeEach ->
				@details = user_name : 'admin', user_pass : 'pass'
				@deferred = currentUser.authenticate @details
				@request = jasmine.Ajax.requests.mostRecent()
				@request.respondWith true

			it 'must make request to /authenticate url', ->
				expect(@request.url).toBe "#{APIURL}/authenticate"
			it 'request method must be POST', ->
				expect(@request.method).toBe 'POST'
			it 'must make request with params', ->
				reqParams = user_name: [ 'admin' ], user_pass: [ 'pass' ]
				expect(@request.data()).toEqual reqParams

		describe 'Facebook authentication', ->
			beforeEach ->
				spyOn(FB, 'login').and.callFake (cb)->
						cb authResponse : true

				@deferred = currentUser.authenticate 'facebook', scope: 'email'
				@request = jasmine.Ajax.requests.mostRecent()

			it 'must call FB.login', ->
				expect(FB.login).toHaveBeenCalled()
			it 'must make request to /authenticate url', ->
				expect(@request.url).toBe "#{APIURL}/authenticate"
			it 'request method must be POST', ->
				expect(@request.method).toBe 'POST'
			it 'must make request with params', ->
				reqParams = type: [ 'facebook' ], user_email: [ 'someemail@mail.com' ]
				expect(@request.data()).toEqual reqParams











