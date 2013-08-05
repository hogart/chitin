(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', '_', 'Chitin', 'jquery.chitin'], factory);
    } else {
        // Browser globals
        factory(jQuery, _, Chitin);
    }
}(function ($, _, Chitin) {
    if (!Chitin.Widgets) {
        /**
         * @namespace all built-in Chitin widgets
         */
        Chitin.Widgets = {}
    }

    /**
     * Simple, flexible, highly configurable tabs
     * @class Chitin.Widgets.Tabs
     */
    var Tabs = Chitin.Widgets.Tabs = Chitin.Widget.extend(
        /** @lends Chitin.Widgets.Tabs.prototype */{
            defaults: {
                silentStart: false
            },

            events: function () {
                var events = {};

                events['click ' + this.params.tabSelector] = 'onTabClick';

                return events;
            },

            _ui: function () {
                return {
                    tabs: this.params.tabSelector,
                    panes: this.params.paneSelector
                };
            },

            /**
             * @constructor
             * @param {Object} options
             * @param {String} [options.tabSwitch] class which makes tab selected
             * @param {String} [options.paneSwitch] class which makes pane selected, defaults to tabSwitch
             * @param {String} [options.tabSelector] selector to find tabs
             * @param {String} [options.paneSelector] selector to find panes
             * @param {Number} [options.currentIndex=0] which tab should be selected at start. When non present, Tabs'll try to figure this out from markup; otherwise defaults to first tab
             */
            initialize: function (options) {
                Tabs.__super__.initialize.call(this, options);

                var getOption = _.bind(this.$el.data, this.$el);

                this.params.tabSwitch = this.params.tabSwitch || getOption('data-tab-switch');
                this.params.paneSwitch = this.params.paneSwitch || getOption('data-pane-switch') || getOption('data-tab-switch');
                this.params.tabSelector = this.params.tabSelector || getOption('data-tab-selector');
                this.params.paneSelector = this.params.paneSelector || getOption('data-pane-selector');

                this._ensureUI();


                // determine active tab
                var selectTab = 0; // default is first tab, obviously

                if ('currentIndex' in options) { // force selected tab through options
                    selectTab = options.currentIndex || 0; // if null or undefined, default to 0; otherwise it's caller's trouble
                } else {
                    var active = this.ui.tabs.filter(this.params.tabSelector);
                    if (active.length === 1) { // tab selected through markup
                        selectTab = active.index();
                    }
                }

                this.goTo(selectTab, {silent: this.params.silentStart});
            },

            onTabClick: function (evt) {
                evt.stopPropagation(); // to prevent nested tabs bugs

                var clickedTab = $(evt.target).closest(this.params.tabSelector);

                this.goTo(clickedTab.index());
            },

            /**
             * Activates tab with given `index`. Triggers event, unless truthy `options.silent`.
             * @param {Number} index
             * @param {Object} [options]
             * @param {Boolean} [options.silent=false] Don't trigger 'chitin.tabs.index' event.
             * @param {Boolean} [options.force=false] Force to re-apply classes even when new tab is the same as current.
             */
            goTo: function (index, options) {
                options = options || {};

                if (index !== this.currentIndex || options.force) {
                    var params = this.params;

                    this.currentTab.removeClass(params.tabSwitch);
                    this.currentPane.removeClass(params.paneSwitch);

                    this.currentTab = this.ui.tabs.eq(index).addClass(params.tabSwitch);
                    this.currentPane = this.ui.panes.eq(index).addClass(params.paneSwitch);

                    this.currentIndex = index;
                }

                !options.silent && this.trigger('chitin.tabs.index', this.currentIndex);
            },

            /**
             * Selects previous tab (if possible)
             */
            prev: function () {
                if (this.currentIndex - 1 >= 0) {
                    this.goTo(this.currentIndex - 1);
                }
            },

            /**
             * Selects next tab (if possible)
             */
            next: function () {
                var maxIndex = this.ui.tabs.length;
                if (this.currentIndex + 1 < maxIndex) {
                    this.goTo(this.currentIndex + 1);
                }
            }
        },
        /** @lends Chitin.Widgets.Tabs */{
            /**
             * Performs automagical activation of this widget. Should be called on DOM ready or before closing </body>
             * @param {String} [selector='js-chitinTabs'] Applies Chitin.Widgets.Tabs to each specified node
             */
            autorun: function (selector) {
                $(selector || '.js-chitinTabs').each(function (index, node) {
                    new Tabs({el: node})
                })
            }
        },
        'tabs'
    );
}));
