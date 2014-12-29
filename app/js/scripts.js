var HeaderView, LeftNavView, SocialSingle, UniversitiesSingleView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

window.userData = {};

App.NothingFoundCtrl = Ajency.NothingFoundCtrl;

App.FileUploadCtrl = Ajency.FileUploadCtrl;

App.RootCtrl = (function(_super) {
  __extends(RootCtrl, _super);

  function RootCtrl() {
    return RootCtrl.__super__.constructor.apply(this, arguments);
  }

  RootCtrl.prototype.initialize = function() {
    return this.show(new Marionette.LayoutView({
      template: '#root-template'
    }));
  };

  return RootCtrl;

})(Marionette.RegionController);

App.LoginCtrl = Ajency.LoginCtrl;

App.LsoginCtrl = (function(_super) {
  __extends(LsoginCtrl, _super);

  function LsoginCtrl() {
    return LsoginCtrl.__super__.constructor.apply(this, arguments);
  }

  LsoginCtrl.prototype.initialize = function() {
    return this.show(new Marionette.ItemView({
      template: '#login-template'
    }));
  };

  return LsoginCtrl;

})(Marionette.RegionController);

HeaderView = (function(_super) {
  __extends(HeaderView, _super);

  function HeaderView() {
    return HeaderView.__super__.constructor.apply(this, arguments);
  }

  HeaderView.prototype.template = '<div><nav role="navigation" class="navbar navbar-default navbar-static-top"> <div class="container-fluid"> <div class="navbar-header"> <button data-target="#bs-example-navbar-collapse-8" data-toggle="collapse" class="navbar-toggle collapsed" type="button"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a href="#" class="navbar-brand">Brand</a> </div> <div class="pull-right"> <div ui-region="currentUser"></div> </div> <div id="bs-example-navbar-collapse-8" class="collapse navbar-collapse"> <ul class="nav navbar-nav"> <li class="active"><a href="#">Home</a></li> <li role="presentation"><a href="#/login">Login</a></li> <li role="presentation"><a href="#/login">Login</a></li> </ul> </div><!-- /.navbar-collapse --> </div> </nav></div>';

  HeaderView.prototype.onShow = function() {
    return this.currentUserRegion.show(new Ajency.CurrentUserView({
      model: App.currentUser
    }));
  };

  return HeaderView;

})(Marionette.LayoutView);

App.HeaderCtrl = (function(_super) {
  __extends(HeaderCtrl, _super);

  function HeaderCtrl() {
    return HeaderCtrl.__super__.constructor.apply(this, arguments);
  }

  HeaderCtrl.prototype.initialize = function() {
    return this.show(new HeaderView({
      model: App.currentUser
    }));
  };

  return HeaderCtrl;

})(Marionette.RegionController);

LeftNavView = (function(_super) {
  __extends(LeftNavView, _super);

  function LeftNavView() {
    return LeftNavView.__super__.constructor.apply(this, arguments);
  }

  LeftNavView.prototype.template = '<div><ul style="max-width: 300px;" class="nav nav-pills nav-stacked"> <li role="presentation"><a href="#/universities/23">universities</a></li> <li role="presentation"><a href="#/socities">socities</a></li> <li role="presentation"><a href="#/socities/23">socities one</a></li> </ul></div>';

  LeftNavView.prototype.ui = {
    ul: '.nav-pills'
  };

  LeftNavView.prototype.behaviors = {
    ActiveLink: {
      behaviorClass: Ajency.ActiveLinkBehavior,
      app: App
    }
  };

  return LeftNavView;

})(Marionette.ItemView);

App.LeftNavCtrl = (function(_super) {
  __extends(LeftNavCtrl, _super);

  function LeftNavCtrl() {
    return LeftNavCtrl.__super__.constructor.apply(this, arguments);
  }

  LeftNavCtrl.prototype.initialize = function() {
    return this.show(new LeftNavView);
  };

  return LeftNavCtrl;

})(Marionette.RegionController);

App.UniversitieslistCtrl = (function(_super) {
  __extends(UniversitieslistCtrl, _super);

  function UniversitieslistCtrl() {
    return UniversitieslistCtrl.__super__.constructor.apply(this, arguments);
  }

  UniversitieslistCtrl.prototype.initialize = function() {
    return this.show(new Marionette.ItemView({
      template: '<div>Awesome UniversitieslistCtrl <a href="#/universities/23">Go</a> <a href="#/socities">socities</a></div>'
    }));
  };

  return UniversitieslistCtrl;

})(Marionette.RegionController);

App.SocitiesListCtrl = (function(_super) {
  __extends(SocitiesListCtrl, _super);

  function SocitiesListCtrl() {
    return SocitiesListCtrl.__super__.constructor.apply(this, arguments);
  }

  SocitiesListCtrl.prototype.initialize = function() {
    return this.show(new Marionette.ItemView({
      template: '<div>Awesome SocitiesListCtrl <a href="#/universities/23">Go</a></div>'
    }));
  };

  return SocitiesListCtrl;

})(Marionette.RegionController);

SocialSingle = (function(_super) {
  __extends(SocialSingle, _super);

  function SocialSingle() {
    return SocialSingle.__super__.constructor.apply(this, arguments);
  }

  SocialSingle.prototype.template = '#socity-single-template';

  SocialSingle.prototype.ui = {
    ul: '.nav-pills'
  };

  SocialSingle.prototype.behaviors = {
    ActiveLink: {
      behaviorClass: Ajency.ActiveLinkBehavior,
      app: App
    }
  };

  SocialSingle.prototype.onShow = function() {
    return this.$el.find('.nav-pills li a').first().trigger('click');
  };

  return SocialSingle;

})(Marionette.LayoutView);

App.SocitiesSingleCtrl = (function(_super) {
  __extends(SocitiesSingleCtrl, _super);

  function SocitiesSingleCtrl() {
    return SocitiesSingleCtrl.__super__.constructor.apply(this, arguments);
  }

  SocitiesSingleCtrl.prototype.initialize = function() {
    var view;
    view = new SocialSingle();
    return this.show(view);
  };

  return SocitiesSingleCtrl;

})(Marionette.RegionController);

App.SocitiesTab1Ctrl = (function(_super) {
  __extends(SocitiesTab1Ctrl, _super);

  function SocitiesTab1Ctrl() {
    return SocitiesTab1Ctrl.__super__.constructor.apply(this, arguments);
  }

  SocitiesTab1Ctrl.prototype.initialize = function() {
    return this.show(new Marionette.ItemView({
      template: '<div>Awesome SocitiesTab1Ctrl</div>'
    }));
  };

  return SocitiesTab1Ctrl;

})(Marionette.RegionController);

App.SocitiesTab2Ctrl = (function(_super) {
  __extends(SocitiesTab2Ctrl, _super);

  function SocitiesTab2Ctrl() {
    return SocitiesTab2Ctrl.__super__.constructor.apply(this, arguments);
  }

  SocitiesTab2Ctrl.prototype.initialize = function() {
    return this.show(new Marionette.ItemView({
      template: '<div>Awesome SocitiesTab2Ctrl</div>'
    }));
  };

  return SocitiesTab2Ctrl;

})(Marionette.RegionController);

App.SocitiesTab3Ctrl = (function(_super) {
  __extends(SocitiesTab3Ctrl, _super);

  function SocitiesTab3Ctrl() {
    return SocitiesTab3Ctrl.__super__.constructor.apply(this, arguments);
  }

  SocitiesTab3Ctrl.prototype.initialize = function() {
    return this.show(new Marionette.ItemView({
      template: '<div>Awesome SocitiesTab3Ctrl</div>'
    }));
  };

  return SocitiesTab3Ctrl;

})(Ajency.RegionController);

UniversitiesSingleView = (function(_super) {
  __extends(UniversitiesSingleView, _super);

  function UniversitiesSingleView() {
    return UniversitiesSingleView.__super__.constructor.apply(this, arguments);
  }

  UniversitiesSingleView.prototype.template = '#universities-single-template';

  UniversitiesSingleView.prototype.tagName = 'form';

  UniversitiesSingleView.prototype.behaviors = {
    FormBehavior: {
      behaviorClass: Ajency.FormBehavior
    }
  };

  UniversitiesSingleView.prototype.onFormInit = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log.apply(console, args);
  };

  return UniversitiesSingleView;

})(Marionette.ItemView);

App.UniversitiesSingleCtrl = (function(_super) {
  __extends(UniversitiesSingleCtrl, _super);

  function UniversitiesSingleCtrl() {
    return UniversitiesSingleCtrl.__super__.constructor.apply(this, arguments);
  }

  UniversitiesSingleCtrl.prototype.initialize = function() {
    return this.show(new UniversitiesSingleView);
  };

  return UniversitiesSingleCtrl;

})(Ajency.RegionController);

jQuery(document).ready(function($) {
  App.state('login').state('root', {
    url: '/',
    sections: {
      'header': {
        ctrl: 'HeaderCtrl'
      },
      'leftnav': {
        ctrl: 'LeftNavCtrl'
      }
    }
  }).state('universitieslist', {
    parent: 'root',
    url: '/universities'
  }).state('universitiesSingle', {
    parent: 'root',
    url: '/universities/:id'
  }).state('socitiesList', {
    parent: 'root',
    url: '/socities'
  }).state('socitiesSingle', {
    parent: 'root',
    url: '/socities/:id'
  }).state('socitiesTab1', {
    parent: 'socitiesSingle',
    url: '/tab1'
  }).state('socitiesTab2', {
    parent: 'socitiesSingle',
    url: '/tab2'
  }).state('socitiesTab3', {
    parent: 'socitiesSingle',
    url: '/tab3',
    ctrl: 'FileUploadCtrl'
  });
  App.addInitializer(function() {
    App.currentUser.set(userData);
    Backbone.history.start();
    return App.navigate('/universities/23', true);
  });
  return App.start();
});
