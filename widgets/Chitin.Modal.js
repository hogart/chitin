(function (factory) {
  if (typeof define === 'function' && define.amd) {
    	// AMD. Register as an anonymous module.
		define(['jquery', '_', '../b-common/chitin', 'jquery.chitin'], factory);
	} else {
		// Browser globals
		factory(jQuery, _, Chitin);
	}
}(function ($, _, Chitin) {
	var Modal = Chitin.Widget.extend(
		{
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
			},

			hide: function () {
				this.ui.modalBody.css({marginRight: 0});
				this.$el.removeClass('modal-visible');

				this.globals.body
					.removeClass('overflowhidden')
					.css({marginRight: 0});

				this.globals.footer
					.css({
						paddingRight: 0,
						right: 0
					});

				this.opened = false;
			},

			onCloseClick: function (evt) {
				var isCloseLink = evt.target.className.indexOf('js-closeModal') > -1,
					isShade = this.$el.is(evt.target) && this.params.closeOnShade;

				if (isCloseLink || isShade) {
					this.hide();
				}
			},

			onEsc: function (evt) {
				if (evt.which == 27 && this.opened) {
					this.hide();
				}
			}
		},
		{
			autorun: function () {
				var instances = this.instances = [];

				this.scrollBarWidth = this._getScrollbarWidth();

				$('body').on('click', '.js-chitinModal', function (evt) {
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
