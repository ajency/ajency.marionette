window.userData = {}

App.NothingFoundCtrl = Ajency.NothingFoundCtrl
App.FileUploadCtrl = Ajency.FileUploadCtrl
class App.RootCtrl extends Marionette.RegionController
	initialize : ->
		@show new Marionette.LayoutView template : '#root-template'

App.LoginCtrl = Ajency.LoginCtrl
class App.LsoginCtrl extends Marionette.RegionController
	initialize : ->
		@show new Marionette.ItemView template : '#login-template'

class HeaderView extends Marionette.LayoutView
	template : '<div><nav role="navigation" class="navbar navbar-default navbar-static-top">
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
				<div ui-region="currentUser"></div>
			</div>
			<div id="bs-example-navbar-collapse-8" class="collapse navbar-collapse">
			  <ul class="nav navbar-nav">
				<li class="active"><a href="#">Home</a></li>
				<li role="presentation"><a href="#/login">Login</a></li>
				<li role="presentation"><a href="#/login">Login</a></li>
			  </ul>
			</div><!-- /.navbar-collapse -->
		  </div>
		</nav></div>'
	onShow : ->
		@currentUserRegion.show new Ajency.CurrentUserView model : App.currentUser

class App.HeaderCtrl extends Marionette.RegionController
	initialize : ->
		@show new HeaderView model : App.currentUser

class LeftNavView extends Marionette.ItemView
	template : '<div><ul style="max-width: 300px;" class="nav nav-pills nav-stacked">
				  <li role="presentation"><a href="#/universities/23">universities</a></li>
				  <li role="presentation"><a href="#/socities">socities</a></li>
				  <li role="presentation"><a href="#/socities/23">socities one</a></li>
				</ul></div>'

	ui :
		ul : '.nav-pills'

	behaviors :
		ActiveLink :
			behaviorClass : Ajency.ActiveLinkBehavior
			app : App

class App.LeftNavCtrl extends Marionette.RegionController
	initialize : ->
		@show new LeftNavView

class App.UniversitieslistCtrl extends Marionette.RegionController
	initialize : ->
		@show new Marionette.ItemView template : '<div>Awesome UniversitieslistCtrl
												<a href="#/universities/23">Go</a>
												<a href="#/socities">socities</a></div>'

class App.SocitiesListCtrl extends Marionette.RegionController
	initialize : ->
		@show new Marionette.ItemView template : '<div>Awesome SocitiesListCtrl
												<a href="#/universities/23">Go</a></div>'

class SocialSingle extends Marionette.LayoutView
	template : '#socity-single-template'
	ui :
		ul : '.nav-pills'

	behaviors :
		ActiveLink :
			behaviorClass : Ajency.ActiveLinkBehavior
			app : App
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

class UniversitiesSingleView extends Marionette.ItemView
	template : '#universities-single-template'
	tagName : 'form'
	behaviors:
		FormBehavior :
			behaviorClass : Ajency.FormBehavior

	onFormInit : (args...)->
		console.log args...

class App.UniversitiesSingleCtrl extends Marionette.RegionController
	initialize : ->
		@show new UniversitiesSingleView

jQuery(document).ready ($)->

	App.state 'login'

		.state 'root',
				url : '/'
				sections :
					'header' :
						ctrl : 'HeaderCtrl'
					'leftnav' :
						ctrl : 'LeftNavCtrl'
		.state 'universitieslist',
				parent : 'root'
				url : '/universities'

		.state 'universitiesSingle',
				parent : 'root'
				url : '/universities/:id'

		.state 'socitiesList',
				parent : 'root'
				url : '/socities'

		.state 'socitiesSingle',
				parent : 'root'
				url : '/socities/:id'

		.state 'socitiesTab1',
				parent : 'socitiesSingle'
				url : '/tab1'

		.state 'socitiesTab2',
				parent : 'socitiesSingle'
				url : '/tab2'

		.state 'socitiesTab3',
				parent : 'socitiesSingle'
				url : '/tab3'
				ctrl  :'FileUploadCtrl'

	App.addInitializer ->
		App.currentUser.set userData
		Backbone.history.start()
		App.navigate '/universities/23', true

	App.start()

