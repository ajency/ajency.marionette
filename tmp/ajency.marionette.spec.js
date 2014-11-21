describe("Marionette TemplateCache", function() {
  describe("when using script tag as template", function() {
    beforeEach(function() {
      Marionette.TemplateCache.clear();
      this.data = {
        foo: 'bar'
      };
      return setFixtures('<script id="foo" type="template">My {{foo}}</script>');
    });
    return it('must compile the template', function() {
      var result;
      result = Marionette.Renderer.render('#foo', this.data);
      return expect('My bar').toEqual(result);
    });
  });
  return describe("when entire template is passed as string", function() {
    beforeEach(function() {
      this.data = {
        foo: 'bar'
      };
      return this.result = Marionette.Renderer.render('<p>{{foo}}</p>', this.data);
    });
    it('must not cache the template', function() {
      return expect(Marionette.TemplateCache.templateCaches['<p>{{foo}}</p>']).toBe(void 0);
    });
    return it('must compile the template', function() {
      return expect('<p>bar</p>').toEqual(this.result);
    });
  });
});
