# Chitin

Chitin helps you build complex web sites and simple web apps, giving you basic inheritance, event management API
and means of organazing your widgets in nested structures. Additionaly, jquery.chitin.js provides infrastructure
for building jQueryUI-like widgets.
Inheritance and event management are borrowed from [Backbone.js](http://backbonejs.org/#Model-extend), so it may
be already familiar to you.

## API

### `Chitin.Abstract`
`Chitin.Abstract` is Chitin's hierarchy root. You can use it to built your own subclasses, e.g. models, controllers or business logic objects.

* `Chitin.Abstract#initialize` basically is constructor. It accepts one argument, `/** Object*/ options`. `options` got mixed with `this.defaults` to provide `this.params`
* `Chitin.Abstract#_superMethod(/** String */ name, /** arguments|Array */args)` is utility method for calling overriden parent method:
    ```javascript
        var SomeClass = Chitin.Abstract.extend({
            initialize: function (options) {
                console.log('SomeClass');
                this._superMethod('initialize', arguments);
            }
        })
    ```
* `Chitin.Abstract#_superProperty(/** String */ name)` Chitin extensively uses "property can be plain object or function returning such object" paradigm. This method helps
you get parent's properties:
```javascript
    var Dialog = Chitin.Widget.extend({
        events: {
            'click .js-close': 'close'
        }
    });

    var DialogForm = Dialog.extend({
        events: function () {
            var parentEvents = this._superProperty('events');

            var events = _.extend({}, parentEvents, {
                'reset form': 'close'
            })
        }
    })
```
* `Chitin.Abstract.extend` is static method providing inheritance mechanism. Please refer to [Backbone.js documentation](http://backbonejs.org/#Model-extend) for further info.

### `Chitin.Observable`
`Chitin.Observable` inherits directly from `Chitin.Abstract` and mixes in [Events module](http://backbonejs.org/#Events). Event management is pretty standart: `on`, `off`, `trigger`
and so on.


###`Chitin.Widget`
`Chitin.Widget`s are heavily inspired by [Backbone's View](http://backbonejs.org/#View), but provide more declarational properties and can manage nested widgets. Like it's inspirer,
widgets have [`$el`](http://backbonejs.org/#View-$el) property, [`$`](http://backbonejs.org/#View-$e) function and handles [`event` property](http://backbonejs.org/#View-delegateEvents) same way.

####Rendering
`Chitin.Widget` isn't so render-agnostic as Backbone.View, it relies on _.template by default as render mechanism, although this behaviour can be easily changed.
By default, when you call `render(someData)` method, following things happen:

1. Widget looks up `tpl` property (and throws exception if not found)
2. Widget prepends this property content with `Chitin.config.templateSelectorPrefix` (`'script.js-tpl-'` by default) and forces jQuery to search node by this selector
3. If no such node found or there's too many of them, exception is thrown
4. This node's content is passed to `Chitin.config.templateEngine` (`_.template` by default) along with `someData`
5. Widget's element's innerHTML gets replaced by value returned on previous step

#### UI
If your widget lives long enough and update it's content from time to time, you probably find yourself updating pieces of widget's DOM manually (not every click should lead to complete re-rendering). To help you with this, `Chitin.Widget` provides automagical `_ui` property. `_ui` is hash which keys are names and values are selectors to search for inside widget's DOM:
```javascript
var Dialog = Chitin.Widget.extend({
    events: {
        'submit form': 'onSubmit'
    },

    _ui: {
        ajaxLoader: '.js-loader'
    },

    onSubmit: function (evt) {
        evt.preventDefault();

        this.ui.ajaxLoader.show();
    }
});
```


## Compatibility and requirements
Chitin should work nicely either with AMD/Require.js loaders and without them. It requires
[underscore](http://underscorejs.org) and [jQuery](http://jquery.org), but will work with
[lo-dash](http://lodash.com/) and [Zepto](http://zeptojs.com/). When in AMD-mode, Chitin expects
jQuery/Zepto as '$' and underscore/lo-dash as '_'.
