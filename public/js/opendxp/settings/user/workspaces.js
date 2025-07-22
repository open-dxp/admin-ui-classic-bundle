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


opendxp.registerNS("opendxp.settings.user.workspaces");
/**
 * @private
 */
opendxp.settings.user.workspaces = Class.create({

    initialize: function (userPanel) {
        this.userPanel = userPanel;
        this.data = this.userPanel.data;
    },

    getPanel: function () {


        this.asset = new opendxp.settings.user.workspace.asset(this);
        this.document = new opendxp.settings.user.workspace.document(this);
        this.object = new opendxp.settings.user.workspace.object(this);

        this.panel = new Ext.Panel({
            title: t("workspaces"),
            bodyStyle: "padding:10px;",
            autoScroll: true,
            items: [this.document.getPanel(), this.asset.getPanel(), this.object.getPanel()]
        });

        return this.panel;
    },

    disable: function () {
        this.panel.disable();
    },

    enable: function () {
        this.panel.enable();
    },

    getValues: function () {
        return {
            asset: this.asset.getValues(),
            object: this.object.getValues(),
            document: this.document.getValues()
        };
    }

});