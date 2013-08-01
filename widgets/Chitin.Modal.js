(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', '_', 'Chitin', 'jquery.chitin'], factory);
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
				doc: document
			},

			events: {
				'click': 'onCloseClick'
			},

			_ui: {
				modalBody: '.b-modal',
				spacer: '.b-modal_space'
			},

			initialize: function (options) {
				this._superMethod('initialize', arguments);

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

			_getScrollbarWidth: function () {
				var body = this.globals.body,
					widthSmall,
					widthLarge;

				body.addClass('b-modal_bodytest_one');
				widthSmall = body.width();

				body.removeClass('b-modal_bodytest_one').addClass('b-modal_bodytest_two');
				widthLarge = body.width();
				body.removeClass('b-modal_bodytest_two');

				return widthLarge - widthSmall;
			},

			show: function () {
				var scrollBarWidth = this._getScrollbarWidth(),
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
					})
			},

			onCloseClick: function (evt) {
				if (evt.target.className.indexOf('js-closeModal') > -1) {
					this.hide();
				}
			}
		},
		{
			autorun: function () {
				var instances = this.instances = [];

				$('body').on('click.chitinModal', '.js-chitinModal', function (evt) {
					var target = $(evt.target),
						selector = target.attr('data-modal-selector');

					var instance = _.filter(instances, function (modalInstance) {
						return modalInstance.$el.is(selector);
					})[0]; // _.filter returns array

					if (instance) {
						instance.show();
					} else {
						instances.push(
							new Modal({el: selector, show: true})
						)
					}
				})
			}
		},
		'modal'
	)
}));
