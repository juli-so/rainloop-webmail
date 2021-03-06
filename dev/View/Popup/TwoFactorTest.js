
(function () {

	'use strict';

	var
		_ = require('_'),
		ko = require('ko'),

		Enums = require('Common/Enums'),
		Utils = require('Common/Utils'),

		Remote = require('Storage/User/Remote'),

		kn = require('Knoin/Knoin'),
		AbstractView = require('Knoin/AbstractView')
	;

	/**
	 * @constructor
	 * @extends AbstractView
	 */
	function TwoFactorTestPopupView()
	{
		AbstractView.call(this, 'Popups', 'PopupsTwoFactorTest');

		var self = this;

		this.code = ko.observable('');
		this.code.focused = ko.observable(false);
		this.code.status = ko.observable(null);

		this.testing = ko.observable(false);

		// commands
		this.testCode = Utils.createCommand(this, function () {

			this.testing(true);
			Remote.testTwoFactor(function (sResult, oData) {

				self.testing(false);
				self.code.status(Enums.StorageResultType.Success === sResult && oData && oData.Result ? true : false);

			}, this.code());

		}, function () {
			return '' !== this.code() && !this.testing();
		});

		kn.constructorEnd(this);
	}

	kn.extendAsViewModel(['View/Popup/TwoFactorTest', 'PopupsTwoFactorTestViewModel'], TwoFactorTestPopupView);
	_.extend(TwoFactorTestPopupView.prototype, AbstractView.prototype);

	TwoFactorTestPopupView.prototype.clearPopup = function ()
	{
		this.code('');
		this.code.focused(false);
		this.code.status(null);
		this.testing(false);
	};

	TwoFactorTestPopupView.prototype.onShow = function ()
	{
		this.clearPopup();
	};

	TwoFactorTestPopupView.prototype.onFocus = function ()
	{
		this.code.focused(true);
	};

	module.exports = TwoFactorTestPopupView;

}());