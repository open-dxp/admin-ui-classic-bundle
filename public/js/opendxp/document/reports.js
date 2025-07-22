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

opendxp.registerNS("opendxp.document.reports");
/**
 * @private
 */
opendxp.document.reports = Class.create({


    initialize: function(document) {
        this.document = document;
    },

    getLayout: function () {

        if (this.layout == null) {

            this.tree = new Ext.tree.TreePanel({
                xtype: "treepanel",
                region: "west",
                width: 200,
                enableDD: false,
                autoScroll: true,
                rootVisible: false,
                root: {
                    id: "0",
                    root: true,
                    reference: this,
                    listeners: this.getTreeNodeListeners()
                }
            });

            this.layout = new Ext.Panel({
                title: t('reports'),
                border: false,
                layout: "border",
                items: [this.tree, {
                    region: "center",
                    html: "das ist ein test"
                }],
                iconCls: "opendxp_icon_reports"
            });
        }

        return this.layout;
    },

    getTreeNodeListeners: function () {

    }
});