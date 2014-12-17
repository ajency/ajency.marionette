
uploadTemplate = '<img src="{{sizes.thumbnail.url}}" width="100"
					height="100" class="img-responsive img-rounded" />
		    		<input type="hidden" name="media_id" value="{{id}}"/>
		    		<input type="hidden" name="media_sizes" value="{{sizesToString}}"/>
		    		<div id="filelist">Your browser doesnt have Flash, Silverlight or HTML5 support.</div>
		        	<br />
			        <div id="container">
			            <a id="pickfiles" href="javascript:;">[Select file]</a>
			            <a id="uploadfiles" href="javascript:;">[Upload file]</a>
			        </div>
		        <br />'

class Ajency.UploadView extends Marionette.ItemView
	template : Handlebars.compile uploadTemplate
	initialize : (opt)->
		{@model} = opt
	mixinTemplateHelpers : (data)->
		data = super data
		data.sizesToString = JSON.stringify data.sizes
		data

	_pluploadHeaders : ->
		if (!authNS.localStorage.isSet('HTTP_X_API_KEY'))
			return

		apiSignature = ''
		timeStamp = _.now()
		HTTP_X_API_KEY = authNS.localStorage.get('HTTP_X_API_KEY')
		HTTP_X_SHARED_SECRET = authNS.localStorage.get('HTTP_X_SHARED_SECRET')
		args = {
			'api_key': HTTP_X_API_KEY,
			'timestamp': timeStamp + '',
			'request_method': 'POST',
			'request_uri': "#{APIURL}/attachments".replace(window.location.origin, '')
		}
		apiSignature = CryptoJS.MD5(JSON.stringify(args) + HTTP_X_SHARED_SECRET)
		{
			'HTTP_X_API_KEY': HTTP_X_API_KEY
			'HTTP_X_API_TIMESTAMP': timeStamp
			'HTTP_X_API_SIGNATURE': apiSignature
		}

	onShow : ->
		@uploaded = 0
		#bind plupload script
		@uploader = new plupload.Uploader
				runtimes : "gears,html5,flash,silverlight,browserplus"
				file_data_name : "async-upload"
				browse_button: "pickfiles" # you can pass in id...
				multiple_queues : true
				multipart : true
				urlstream_upload : true
				max_file_size : "2mb"
				url : "#{APIURL}/attachments"
				flash_swf_url : "#{_SITEURL}/wp-includes/js/plupload/plupload.flash.swf"
				silverlight_xap_url : "#{_SITEURL}/wp-includes/js/plupload/plupload.silverlight.xap"
				headers : @_pluploadHeaders()
				filters : [
					title : "Image files"
					extensions : "jpg,gif,png"
				]
				multipart_params :
					action : "upload-attachment"
					_wpnonce : _WP_MEDIA_NONCE
				init:
					PostInit: (up)->
						document.getElementById("filelist").innerHTML = ""
						document.getElementById("uploadfiles").onclick = ->
							up.start()

					FilesAdded: (up, files) ->
						plupload.each files, (file) ->
							document.getElementById("filelist").innerHTML += "<div id=\"" + file.id + "\">" + file.name + " (" + plupload.formatSize(file.size) + ") <b></b></div>"

					UploadProgress: (up, file) ->
						document.getElementById(file.id).getElementsByTagName("b")[0].innerHTML = "<span>" + file.percent + "%</span>"

					Error: (up, err) ->
						document.getElementById("console").innerHTML += "\nError #" + err.code + ": " + err.message

					FileUploaded : (up, file, response)=>
						response = JSON.parse response.response
						@model.set response
						@$el.find('img').attr 'src', @model.get('sizes')['thumbnail']['url']
						@$el.find('input[name="media_id"]').val @model.get 'id'
						@$el.find('input[name="media_sizes"]').val JSON.stringify @model.get('sizes')

		@uploader.init()

	# destroyt the plupload instance on close to release memory
	onClose : ->
		@uploader.destroy()

class Ajency.FileUploadCtrl extends Marionette.RegionController
	initialize : (opt = {})->
		{model} = opt
		@show new Ajency.UploadView model : model
