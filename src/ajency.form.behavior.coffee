class Ajency.FormBehavior extends Marionette.Behavior

	ui :
		submitButton : '.aj-submit-button'
		responseMessage : '.aj-response-message'

	defaults : ->
		successMessage : 'Enter your success message in behavior options'
		errorMessage : 'Enter your error message in behavior options'

	events :
		'click @ui.submitButton' : '_validateForm'

	initialize : ->
		@listenTo @view, 'render', @_initMasking
		@listenTo @view, 'render', @_initValidation
		@listenTo @view, 'destroy', @_cleanUpView
		@view.showSuccessMessage = @_showSuccessMessage
		@view.showRequestFailerMessage = @_showRequestFailerMessage

	_initMasking :->
		inputFields = @view.$('[aj-inputmask]')
		inputFields.each (index, field)->
			$(field).inputmask $(field).attr 'aj-inputmask'

	_initValidation :->
		if @view.$el.prop('tagName') is 'FORM'
			@form = @view.$el
		else
			if @view.$('form').length is 0
				throw new Marionette.Error 'Form tag missing. Please add a form'
			@form = @view.$('form')

		# set parsley namespace
		@form.attr 'data-parsley-namespace', 'aj-field-'
		@validator = @view.validator = $(@form).parsley()
		$(@form).parsley().subscribe 'parsley:form:validate', (formInstance)=> @view.triggerMethod 'form:validate', formInstance
		$(@form).parsley().subscribe 'parsley:form:validated', (formInstance)=> @view.triggerMethod 'form:validated', formInstance
		$(@form).parsley().subscribe 'parsley:field:validate', (formInstance)=> @view.triggerMethod 'field:validate', formInstance
		$(@form).parsley().subscribe 'parsley:field:success', (formInstance)=> @view.triggerMethod 'field:success', formInstance
		$(@form).parsley().subscribe 'parsley:field:error', (formInstance)=> @view.triggerMethod 'field:error', formInstance

	_cleanUpView : ->
		delete @view.validator
		delete @view.showSuccessMessage
		delete @view.showRequestFailerMessage

	_validateForm :(evt)->
		evt.preventDefault()
		if @validator.validate()
			@ui.submitButton.addClass 'aj-form-submit-in-process'
			formData = Backbone.Syphon.serialize @view
			@view.triggerMethod 'form:submit', formData

	_showSuccessMessage : =>
		@ui.responseMessage.addClass('alert-success').html @options.successMessage
		@_removeFormSubmitClass()

	_showRequestFailerMessage : =>
		@ui.responseMessage.addClass('alert-danger').html @options.errorMessage
		@_removeFormSubmitClass()

	_removeFormSubmitClass : ->
		@ui.submitButton.removeClass 'aj-form-submit-in-process'


