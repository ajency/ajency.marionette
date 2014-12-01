describe 'Ajency.RegionController', ->
	_region = null
	beforeEach ->
		setFixtures sandbox()
		_region =  new Marionette.Region el : '#sandbox'

	describe 'on construction of object', ->
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
			@sandboxRegion =  new Marionette.Region el : '#sandbox'
			@ctrl  = new Ajency.RegionController region : @sandboxRegion

		it 'must throw if view is not passed', ->
			expect(-> @ctrl.show() ).toThrow()

		it 'must show view inside the region', ->
			view  = new Marionette.ItemView 'template' : 'My View'
			@ctrl.show view
			expect(@sandboxRegion.currentView).toBe view

	describe 'when checking if currentUser has capability to access state', ->

		beforeEach ->
			@ctrl  = new Ajency.RegionController region : _region, stateName : 'name'

		describe 'When user does not have capability', ->

			beforeEach ->
				spyOn(currentUser, 'hasCap').and.returnValue false

			it 'must call showNoAccessView', ->
				expect(@ctrl.confirmAccess()).toBe false

		describe 'When user does not have capability', ->

			beforeEach ->
				spyOn(currentUser, 'hasCap').and.returnValue false

			it 'must call showNoAccessView', ->
				expect(@ctrl.confirmAccess('name')).toBe false







