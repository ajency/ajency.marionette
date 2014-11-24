
describe 'Ajency.LoginCtrl', ->

	it 'must be defined', ->
		expect(Ajency.LoginCtrl).toBeDefined()

	describe 'on initialization', ->

		beforeEach ->
			setFixtures '<script id="login-template" type="x-template"><p class="post">some markup</p></script>'
			appendSetFixtures sandbox()
			@sandboxRegion =  new Marionette.Region el : '#sandbox'
			@ctrl = new Ajency.LoginCtrl region : @sandboxRegion

		it 'must have the login view', ->
			expect(@ctrl._view).toBeDefined()
