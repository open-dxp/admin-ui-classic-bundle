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

opendxp.registerNS("opendxp.object.classes.layout.panel");
/**
 * @private
 */
opendxp.object.classes.layout.panel = Class.create(opendxp.object.classes.layout.layout, {

    type: "panel",

    initialize: function (treeNode, initData) {
        this.type = "panel";

        this.initData(initData);

        this.treeNode = treeNode;
    },

    getTypeName: function () {
        return t("panel");
    },

    getIconClass: function () {
        return "opendxp_icon_panel";
    },

    getLayout: function ($super) {
        $super();

        var layouts = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {"abbr":"", "name":"Default"},
                {"abbr":"fit", "name":"Fit"}
            ]
        });

        var labelAligns = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {"abbr": "left", "name": t("left")},
                {"abbr": "top", "name": t("top")}
            ]
        });

        this.layout.add({
            xtype: "form",
            bodyStyle: "padding: 10px;",
            autoScroll: true,
            style: "margin: 10px 0 10px 0",
            items: [
                {
                    xtype: "combo",
                    fieldLabel: t("layout"),
                    name: "layout",
                    value: this.datax.layout,
                    store: layouts,
                    triggerAction: 'all',
                    editable: false,
                    displayField: 'name',
                    valueField: 'abbr',
                },
                {
                    xtype: "checkbox",
                    fieldLabel: t("border"),
                    name: "border",
                    checked: this.datax.border,
                },
                {
                    xtype: "numberfield",
                    name: "labelWidth",
                    fieldLabel: t("label_width"),
                    value: this.datax.labelWidth
                },
                {
                    xtype: "combo",
                    fieldLabel: t("label_align"),
                    name: "labelAlign",
                    value: this.datax.labelAlign,
                    store: labelAligns,
                    triggerAction: 'all',
                    editable: false,
                    displayField: 'name',
                    valueField: 'abbr',
                },
                this.getIconFormElement()
            ]
        });

        return this.layout;
    }
});
