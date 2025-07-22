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

opendxp.registerNS("opendxp.settings.maintenance");
/**
 * @private
 */
opendxp.settings.maintenance = Class.create({

    initialize: function () {


        this.window = new Ext.Window({
            layout:'fit',
            width:500,
            height:200,
            closeAction:'close',
            modal: true,
            items: [{
                xtype: "panel",
                border: false,
                bodyStyle: "padding:20px;font-size:14px;",
                html: "<b style='color:red;'>WARNING</b><br />If you activate the maintenance mode all services "
                        + "(website, admin, api, ...) will be deactivated. This should be only done by administrators!"
                        + "<br />Only this browser (session) will be still able to access the services."
            }],
            buttons: [{
                text: t("activate"),
                iconCls: "opendxp_icon_apply",
                handler: this.activate.bind(this)
            }]
        });

        opendxp.viewport.add(this.window);

        this.window.show();

    },

    activate: function () {
        this.window.close();
        opendxp.helpers.activateMaintenance();
    },

    deactivate: function () {
        opendxp.helpers.deactivateMaintenance();
    }
});
