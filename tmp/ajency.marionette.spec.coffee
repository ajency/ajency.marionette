
describe "Marionette TemplateCache", ->

	beforeEach ->
		Marionette.TemplateCache.clear()
		@data = foo : 'value'
		setFixtures '<script id="foo" type="template">My {{foo}}</script>'

	it 'must compile the template', ->
		result = Marionette.Renderer.render '#foo', @data
		expect result
			.toEqual 'My value'
