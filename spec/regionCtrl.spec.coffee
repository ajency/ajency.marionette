describe 'Ajency.RegionController', ->
	_region = null
	beforeEach ->
		setFixtures sandbox()
		_region =  new Marionette.Region el : '#sandbox'

	describe 'on construction of object', ->
		beforeEach ->
			spyOn(Ajency.RegionController::,'confirmAccess').and.returnValue true

		it 'must throw error if region not passed', ->
			expect( -> new Ajency.RegionController() ).toThrow()
			expect( -> new Ajency.RegionController region : 'not a region object' ).toThrow()

		it 'must have the unique id', ->
			regionCtrl = new Ajency.RegionController region : _region
			expect(regionCtrl._ctrlID).toBeDefined()

		it 'must have the region object assigned to region property', ->
			regionCtrl = new Ajency.RegionController region : _region
			expect(regionCtrl._region).toBe _region


	describe "showing a view in region", ->

		beforeEach ->
			spyOn(Ajency.RegionController::,'confirmAccess').and.returnValue true
			@sandboxRegion =  new Marionette.Region el : '#sandbox'
			@ctrl  = new Ajency.RegionController region : @sandboxRegion

		it 'must throw if view is not passed', ->
			expect(-> @ctrl.show() ).toThrow()

		it 'must show view inside the region', ->
			view  = new Marionette.ItemView 'template' : 'My View'
			@ctrl.show view
			expect(@sandboxRegion.currentView).toBe view

	describe 'when getting the no access view', ->

		beforeEach ->
			RCtrl = jasmine.createSpy(Ajency.RegionController)
			ctrl = new RCtrl
			@noAccessType = ctrl._getNoAccessType()

		describe 'When user is not logged in and capability is true', ->

			it 'muss return undefined', ->
			  	expect(@noAccessType).toEqual 'notdefined'





