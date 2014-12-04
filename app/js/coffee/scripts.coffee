window.userData =
    "ID": "1"
    "user_login": "admin"
    "user_nicename": "admin nicename"
    "user_email": "suraj@mailinator.com"
    "user_url": ""
    "user_registered": "2014-11-25 06:21:19"
    "user_activation_key": ""
    "user_status": "0"
    "display_name": "admin displayname"
    "caps":
         "switch_themes": true
        "edit_themes": true
        "activate_plugins": true
        "edit_plugins": true
        "edit_users": true
        "edit_files": true
        "manage_options": true
        "moderate_comments": true
        "manage_categories": true
        "manage_links": true
        "upload_files": true
        "import": true
        "unfiltered_html": true
        "edit_posts": true
        "edit_others_posts": true
        "edit_published_posts": true
        "publish_posts": true
        "edit_pages": true
        "read": true
        "level_10": true
        "level_9": true
        "level_8": true
        "level_7": true
        "level_6": true
        "level_5": true
        "level_4": true
        "level_3": true
        "level_2": true
        "level_1": true
        "level_0": true
        "edit_others_pages": true
        "edit_published_pages": true
        "publish_pages": true
        "delete_pages": true
        "delete_others_pages": true
        "delete_published_pages": true
        "delete_posts": true
        "delete_others_posts": true
        "delete_published_posts": true
        "delete_private_posts": true
        "edit_private_posts": true
        "read_private_posts": true
        "delete_private_pages": true
        "edit_private_pages": true
        "read_private_pages": true
        "delete_users": true
        "create_users": true
        "unfiltered_upload": true
        "edit_dashboard": true
        "update_plugins": true
        "delete_plugins": true
        "install_plugins": true
        "update_themes": true
        "install_themes": true
        "update_core": true
        "list_users": true
        "remove_users": true
        "add_users": true
        "promote_users": true
        "edit_theme_options": true
        "delete_themes": true
        "export": true
        "administrator": true


# coffescript code here
Marionette.RegionControllers::controllers = App

class App.RootCtrl extends Marionette.RegionController
	initialize : ->
		@show new Marionette.LayoutView template : '#root-template'


class App.LoginCtrl extends Marionette.RegionController
	initialize : ->
		@show new Marionette.ItemView template : '#login-template'

class HeaderView extends Marionette.ItemView
	template : '<div><nav role="navigation" class="navbar navbar-default navbar-static-top">
		  <!-- We use the fluid option here to avoid overriding the fixed width of a normal container within the narrow content columns. -->
		  <div class="container-fluid">
			<div class="navbar-header">
			  <button data-target="#bs-example-navbar-collapse-8" data-toggle="collapse" class="navbar-toggle collapsed" type="button">
				<span class="sr-only">Toggle navigation</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			  </button>
			  <a href="#" class="navbar-brand">Brand</a>
			</div>
			<div class="pull-right">
				<div></div>
			</div>
			<!-- Collect the nav links, forms, and other content for toggling -->
			<div id="bs-example-navbar-collapse-8" class="collapse navbar-collapse">
			  <ul class="nav navbar-nav">
				<li class="active"><a href="#">Home</a></li>
				<li><a href="#">Link</a></li>
				<li><a href="#">Link</a></li>
			  </ul>
			</div><!-- /.navbar-collapse -->
		  </div>
		</nav></div>'



class App.HeaderCtrl extends Marionette.RegionController
	initialize : ->
		@show new HeaderView model : App.currentUser

class App.LeftNavCtrl extends Marionette.RegionController
	initialize : ->
		@show new Marionette.ItemView template : '<div><ul style="max-width: 300px;" class="nav nav-pills nav-stacked">
	  <li class="active" role="presentation"><a href="#/universities/23">universities</a></li>
	  <li role="presentation"><a href="#/socities">socities</a></li>
	  <li role="presentation"><a href="#/socities/23">socities one</a></li>
	</ul></div>'

class App.UniversitieslistCtrl extends Marionette.RegionController
	initialize : ->
		@show new Marionette.ItemView template : '<div>Awesome UniversitieslistCtrl
												<a href="#/universities/23">Go</a>
												<a href="#/socities">socities</a></div>'

class App.SocitiesListCtrl extends Marionette.RegionController
	initialize : ->
		@abc = '123'
		@show new Marionette.ItemView template : '<div>Awesome SocitiesListCtrl
												<a href="#/universities/23">Go</a></div>'

class SocialSingle extends Marionette.LayoutView
	template : '#socity-single-template'
	onShow : ->
		@$el.find('.nav-pills li a').first().trigger 'click'

class App.SocitiesSingleCtrl extends Marionette.RegionController
	initialize : ->
		view = new SocialSingle()
		@show view

class App.SocitiesTab1Ctrl extends Marionette.RegionController
	initialize : ->
		@show new Marionette.ItemView template : '<div>Awesome SocitiesTab1Ctrl</div>'

class App.SocitiesTab2Ctrl extends Marionette.RegionController
	initialize : ->
		@show new Marionette.ItemView template : '<div>Awesome SocitiesTab2Ctrl</div>'

class App.SocitiesTab3Ctrl extends Ajency.RegionController
	initialize : ->
		@show new Marionette.ItemView template : '<div>Awesome SocitiesTab3Ctrl</div>'

class App.UniversitiesSingleCtrl extends Marionette.RegionController
	initialize : ->
		@show new Marionette.ItemView template : '<div>Awesome UniversitiesSingleCtrl <a href="#/universities">Go</a></div>'


jQuery(document).ready ($)->


	class AppStates extends Marionette.AppStates

		appStates :
			'login' : true
			'root' :
				url : '/'
				sections :
					'header' :
						ctrl : 'HeaderCtrl'
					'leftnav' :
						ctrl : 'LeftNavCtrl'
			'universitieslist' :
				parent : 'root'
				url : '/universities'
			'universitiesSingle' :
				parent : 'root'
				url : '/universities/:id'
			'socitiesList' :
				parent : 'root'
				url : '/socities'
			'socitiesSingle' :
				parent : 'root'
				url : '/socities/:id'
			'socitiesTab1' :
				parent : 'socitiesSingle'
				url : '/tab1'
			'socitiesTab2' :
				parent : 'socitiesSingle'
				url : '/tab2'
			'socitiesTab3' :
				parent : 'socitiesSingle'
				url : '/tab3'


	App.addInitializer ->
		App.currentUser.set userData
		new AppStates app : App
		Backbone.history.start()
		App.navigate '/socities/23/tab3', true

	App.start()

