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

opendxp.registerNS("opendxp.element.tag.configuration");
/**
 * @private
 */
opendxp.element.tag.configuration = Class.create({

    initialize: function() {
        var tabPanel = Ext.getCmp("opendxp_panel_tabs");
        tabPanel.add(this.getLayout());
        tabPanel.setActiveItem("tag_configuration");

        this.getLayout().on("destroy", function () {
            opendxp.globalmanager.remove("element_tag_configuration");
        });

        opendxp.layout.refresh();
    },

    activate: function () {
        var tabPanel = Ext.getCmp("opendxp_panel_tabs");
        tabPanel.setActiveItem("tag_configuration");
    },

    getLayout: function () {

        if (this.layout == null) {

            var tree = new opendxp.element.tag.tree();

            this.layout = new Ext.Panel({
                id: "tag_configuration",
                title: t('element_tag_configuration'),
                iconCls: "opendxp_icon_element_tags",
                items: [tree.getLayout()],
                layout: "border",
                closable: true
            });

            tree.setFilterFieldWidth(340);
        }

        return this.layout;
    }
});
