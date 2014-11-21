describe("Marionette TemplateCache", function() {
  beforeEach(function() {
    Marionette.TemplateCache.clear();
    this.data = {
      foo: 'value'
    };
    return setFixtures('<script id="foo" type="template">My {{foo}}</script>');
  });
  return it('must compile the template', function() {
    var result;
    result = Marionette.Renderer.render('#foo', this.data);
    return expect(result).toEqual('My value');
  });
});
