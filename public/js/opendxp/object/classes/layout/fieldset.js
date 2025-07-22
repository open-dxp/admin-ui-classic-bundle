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

opendxp.registerNS("opendxp.object.classes.layout.fieldset");
/**
 * @private
 */
opendxp.object.classes.layout.fieldset = Class.create(opendxp.object.classes.layout.layout, {

    type: "fieldset",

    initialize: function (treeNode, initData) {
        this.type = "fieldset";

        this.initData(initData);

        this.treeNode = treeNode;
    },

    getTypeName: function () {
        return t("fieldset");
    },

    getIconClass: function () {
        return "opendxp_icon_fieldset";
    },

    getLayout: function ($super) {
        $super();

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
            style: "margin: 10px 0 10px 0",
            items: [
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
                }
            ]
        });

        return this.layout;
    }

});
