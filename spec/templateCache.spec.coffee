
describe "Marionette Templates and Cache", ->

	describe "when using script tag as template", ->
		beforeEach ->
			Marionette.TemplateCache.clear()
			@data = foo : 'bar'
			setFixtures '<script id="foo-template" type="m-template">My {{foo}}</script>'

		it 'must compile the template', ->
			result = Marionette.Renderer.render '#foo-template', @data
			expect 'My bar'
				.toEqual result

	describe "when entire template is passed as string", ->

		beforeEach ->
			@data = foo : 'bar'
			@result = Marionette.Renderer.render '<p>{{foo}}</p>', @data

		it 'must not cache the template', ->
			expect Marionette.TemplateCache.templateCaches['<p>{{foo}}</p>']
				.toBe undefined
		it 'must compile the template', ->
			expect '<p>bar</p>'
				.toEqual @result
