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

opendxp.registerNS("opendxp.asset.embedded_meta_data");
/**
 * @private
 */
opendxp.asset.embedded_meta_data = Class.create({
    initialize: function(asset) {
        this.asset = asset;
    },

    getPanel: function () {
        if (!this.panel) {


            var data = this.asset.data.customSettings['embeddedMetaData'];

            if(!data){
                return null;
            }

            var newPanel = new Ext.grid.PropertyGrid({
                source: data || [],
                clicksToEdit: 1000,
                viewConfig: {
                    listeners: {
                        refresh: function(dataview) {
                            dataview.panel.getColumns()[0].autoSize();
                        }
                    }
                }
            });
            newPanel.plugins[0].disable();

            this.panel = new Ext.Panel({
                title: t("embedded_meta_data"),
                layout: 'fit',
                iconCls: "opendxp_material_icon_embedded_metadata opendxp_material_icon",
                items: [newPanel]
            });
        }

        return this.panel;
    }
});