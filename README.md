Chitin
======

Chitin helps you build complex web sites and simple web apps, giving you basic inheritance, event management API
and means of organazing your widgets in nested structures.

API
===

`Chitin.Abstract` is Chitin's hierarchy root. It has one method, `initialize`, which accepts one argument, `options`.
All other classes inherits this behavior via `Chitin.Abstract.extend(protoProps, staticProps)`. Inheritance implementation
is borrowed from [Backbone.js](http://backbonejs.org/#Model-extend).

`Chitin.Observable` is more interesting because it has event management API. All following classes are extended from it,
so they have same API. This API is borrowed from [Backbone.js](http://backbonejs.org/#Events) too.

`Chitin.Widget` is powerful, declaration driven, easy extendable widget/view abstract class. 

Compatibility and requirements
==============================

Chitin should work nicely either with AMD/Require.js loaders and without them. It requires 
[underscore](http://underscorejs.org) and [jQuery](http://jquery.org), but will work with 
[lo-dash](http://lodash.com/) and [Zepto](http://zeptojs.com/).
