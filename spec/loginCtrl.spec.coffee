
describe 'Ajency.LoginCtrl', ->

	it 'must be defined', ->
		expect(Ajency.LoginCtrl).toBeDefined()


	describe 'on initialization', ->

		beforeEach ->
			spyOn(currentUser, 'hasCap').and.returnValue true
			loadFixtures 'login-template.html'
			appendSetFixtures sandbox()
			@sandboxRegion =  new Marionette.Region el : '#sandbox'
			@ctrl = new Ajency.LoginCtrl region : @sandboxRegion

		it 'must have the login view', ->
			expect(@ctrl._view).toEqual jasmine.any Ajency.LoginView


describe 'Ajency.LoginView', ->
	view = ''
	beforeEach ->
		setFixtures sandbox()
		loadFixtures 'login-template.html'
		view = new Ajency.LoginView
		$('#sandbox').html view.render().$el

	it 'must have template #login-template', ->
		expect(view.template).toBe '#login-template'

	it 'must call currentUser.authenticate on login button click', ->
		spyOn currentUser, 'authenticate'
		$(view.ui.userLogin).val 'admin'
		$(view.ui.userPass).val 'admin'
		$(view.ui.loginBtn).trigger 'click'
		expect(currentUser.authenticate).toHaveBeenCalledWith
							user_login : 'admin', user_pass : 'admin'

	it 'must call onUserAuthFailed() if authentication fails', ->
		view.onUserAuthFailed = ->
		spyOn(view, 'onUserAuthFailed')
		currentUser.trigger 'user:auth:failed', error : true, message : 'mesage'
		expect(view.onUserAuthFailed).toHaveBeenCalledWith
							error : true, message : 'mesage'

