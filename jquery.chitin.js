(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', '_', 'Chitin'], factory);
    } else {
        // Browser globals
        factory(jQuery, _, Chitin);
    }
}(function ($, _, Chitin) {
    'use strict';

    /**
     * @author <a href="mailto:doctor.hogart@gmail.com">Konstantin Kitmanov</a>
     * May be freely distributed under the MIT license.
     */

    function widgetToPlugin (widgetClass) {
        return function (options) {
            var $el = $(this),
                instance = $el.data('chitin');

            if (!(instance && instance instanceof widgetClass)) {
                options.el = $el;
                instance = new widgetClass(options);

                $el.data('chitin', instance);
            }

            return instance
        }
    }

    var extend = Chitin.Widget.extend, // save original extend
        pluginExtend = function (protoProps, staticProps, name) {
            var cls = extend.apply(this, _.initial(arguments, 2));

            if (arguments.length == 3) { // we should create jQuery plugin
    			$.fn[name] = widgetToPlugin(cls);
				$.chitin[name] = cls;
            }

            cls.extend = pluginExtend;

            return cls;
        };

    Chitin.Widget.extend = pluginExtend;

    _.extend(Chitin.Widget.prototype, {
        destroy: function () {
            Chitin.Widget.prototype.destroy.call(this);

            if (this.$el.data('chitin')) {
                this.$el.removeData('chitin');
            }
        }
    });

    $.chitin = function (name, parent, protoProps, staticProps) {
        if (arguments.length == 3) {
            parent = Chitin.Widget;
        }

		if (typeof parent == 'string') {
			parent = $.chitin[parent];
		}

        parent.extend(protoProps, staticProps, name);
    };

    /**
     * Getter-setter for widget instance
     * @param {Chitin.Widget} [instance]
     * @returns {Chitin.Widget|undefined} Either instance or undefined
     */
    $.fn.chitin = function (instance) {
        var $el = $(this);

        if (arguments.length) {
            $el.data('chitin', instance);
        } else {
            return $el.data('chitin');
        }
    }
}));
