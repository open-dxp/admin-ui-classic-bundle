/**
 * OpenDXP
 *
 * This source file is licensed under the GNU General Public License version 3 (GPLv3).
 *
 * Full copyright and license information is available in
 * LICENSE.md which is distributed with this source code.
 *
 * @copyright  Copyright (c) Pimcore GmbH (https://pimcore.com)
 * @copyright  Modification Copyright (c) OpenDXP (https://www.opendxp.ch)
 * @license    https://www.gnu.org/licenses/gpl-3.0.html  GNU General Public License version 3 (GPLv3)
 */


opendxp.registerNS("opendxp.settings.profile.twoFactorSettings");
/**
 * @private
 */
opendxp.settings.profile.twoFactorSettings = Class.create({


    initialize: function (data) {
        this.data = data;
    },

    getPanel: function () {

        var buttonLabel = t('setup_two_factor');
        if(this.data['isActive']) {
            buttonLabel = t('renew_2fa_secret');
        }

        var panelConf = {
            xtype: "fieldset",
            title: t("two_factor_authentication"),
            items: [{
                xtype: "button",
                text: buttonLabel,
                style: "margin-right: 10px",
                handler: function () {
                    Ext.Ajax.request({
                        url: Routing.generate('opendxp_admin_user_reset_my_2fa_secret'),
                        method: 'PUT',
                        success: function (response) {
                            window.location.href = Routing.generate('opendxp_admin_2fa_setup');
                        }.bind(this)
                    });
                }.bind(this)
            }, {
                xtype: "button",
                text: t("2fa_disable"),
                hidden: this.data['required'] || !this.data['isActive'],
                handler: function () {
                    Ext.Ajax.request({
                        url: Routing.generate('opendxp_admin_user_disable2fasecret'),
                        method: 'DELETE',
                        success: function (response) {
                            window.location.reload();
                        }.bind(this)
                    });
                }
            }]
        };

        return panelConf;
    }
});
