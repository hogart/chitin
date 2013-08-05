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
	 * Simple modal windows. Features:
	 * 	* Disables page scrolling while open
	 * 	* Closes on Esc (can be turned off)
	 * 	* Closes when shade is clicked
	 * @class Chitin.Widgets.Modal
	 */
    var Modal = Chitin.Widgets.Modal = Chitin.Widget.extend(
		/** @lends Chitin.Widgets.Modal */{
			defaults: {
				body: 'body',
				footer: '.b-footer',
				win: window,
				doc: document,

				closeOnShade: true,
				closeOnEsc: true
			},

			events: {
				'click': 'onCloseClick'
			},

			_ui: {
				modalBody: '.b-modal',
				spacer: '.b-modal_space'
			},

			/**
			 * @constructor
			 * @param {Object} options
			 */
			initialize: function (options) {
				Modal.__super__.initialize.call(this, options);

				this.globals = {
					body: $(this.params.body),
					footer: $(this.params.footer),
					win: $(this.params.win),
					doc: $(this.params.doc)
				};

				this._ensureUI();

				if (this.params.show) {
					this.show();
				}

				this.params.closeOnEsc && this.globals.doc.on('keyup', _.bind(this.onEsc, this));
			},

			_hasPageScroll: function () {
				return this.globals.doc.height() != this.globals.win.height();
			},

			_hasModalScroll: function () {
				if (this._hasPageScroll()) {
					return this.ui.spacer.outerHeight() <= this.$el.height()
				} else {
					return this.ui.spacer.outerHeight() > this.$el.height()
				}
			},

			show: function () {
				var scrollBarWidth = Modal.scrollBarWidth,
					hasPageScroll = this._hasPageScroll(),
					hasModalScroll = this._hasModalScroll(),
					bodyCSS = {
						marginRight: hasPageScroll ? scrollBarWidth : 0
					},
					footerCSS = {
						paddingRight: hasPageScroll ? scrollBarWidth : 0,
						right: hasPageScroll ? -scrollBarWidth : 0
					};

				// show modal
				this.globals.body.addClass('overflowhidden');
				this.$el.addClass('modal-visible');

				// adjust body and footer
				this.globals.body.css(bodyCSS);
				this.globals.footer.css(footerCSS);

				// adjust modal window itself
				var modalCSS = {marginRight: 0};
				if (hasPageScroll) {
					if (hasModalScroll) {
						modalCSS.marginRight = scrollBarWidth
					}
				} else {
					if (hasModalScroll) {
						modalCSS.marginRight = -scrollBarWidth
					}
				}

				this.ui.modalBody.css(modalCSS);

				this.opened = true;

				this.trigger('chitin.modal.show');
			},

			hide: function () {
				this.ui.modalBody.css({marginRight: ''}); // this effectively deletes el.style.marginRight
				this.$el.removeClass('modal-visible');

				this.globals.body
					.removeClass('overflowhidden')
					.css({marginRight: ''});

				this.globals.footer
					.css({
						paddingRight: '',
						right: ''
					});

				this.opened = false;

				this.trigger('chitin.modal.hide');
			},

			onCloseClick: function (evt) {
				var isCloseLink = evt.target.className.indexOf('js-closeModal') > -1,
					isShade = this.$el.is(evt.target) && this.params.closeOnShade,
					isSpacer = this.ui.spacer.is(evt.target);

				if (isCloseLink || isShade || isSpacer) {
					this.hide();
				}
			},

			onEsc: function (evt) {
				if (evt.which == 27 && this.opened) {
					this.hide();
				}
			}
        },
        /** @lends Chitin.Widgets.Modal */{
			/**
			 * Performs automagical activation of this widget. Should be called on DOM ready or before closing </body>
			 * @param {String} [selector='.js-chitinModal'] which elements should fire modal windows
			 */
			autorun: function (selector) {
				var instances = this.instances = [];

				selector = selector || '.js-chitinModal';

				this.scrollBarWidth = this._getScrollbarWidth();

				$('body').on('click', selector, function (evt) {
					var target = $(evt.target),
						selector = target.attr('data-modal-selector');

					var instance = _.filter(instances, function (modalInstance) {
						return modalInstance.$el.is(selector);
					})[0]; // _.filter returns array

					if (instance) {
						instance.show();
					} else {
						instances.push(
							new Modal({el: $(selector), show: true})
						)
					}
				})
			},
			_getScrollbarWidth: function () {
				var body = $('body'),
					widthSmall,
					widthLarge;

				body.addClass('b-modal_bodytest_one');
				widthSmall = body.width();

				body.removeClass('b-modal_bodytest_one').addClass('b-modal_bodytest_two');
				widthLarge = body.width();
				body.removeClass('b-modal_bodytest_two');

				return widthLarge - widthSmall;
			},
        },
        'modal'
    )
}));
