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

opendxp.registerNS("opendxp.object.classes.layout.tabpanel");
/**
 * @private
 */
opendxp.object.classes.layout.tabpanel = Class.create(opendxp.object.classes.layout.layout, {

    type: "tabpanel",

    initialize: function (treeNode, initData) {
        this.type = "tabpanel";

        this.initData(initData);

        this.treeNode = treeNode;
    },

    getTypeName: function () {
        return t("tabpanel");
    },

    getIconClass: function () {
        return "opendxp_icon_tabpanel";
    },

    getLayout: function ($super) {
        $super();

        this.layout.add({
            xtype: "form",
            bodyStyle: "padding: 10px;",
            style: "margin: 10px 0 10px 0",
            items: [
                {
                    xtype: "checkbox",
                    fieldLabel: t("border"),
                    name: "border",
                    checked: this.datax.border,
                }, {
                    xtype: 'combo',
                    fieldLabel: t('tab_position'),
                    name: 'tabPosition',
                    value: this.datax.tabPosition,
                    editable: false,
                    store: [['top', t('top')], ['left', t('left')], ['right', t('right')], ['bottom', t('bottom')]]
                }
            ]
        });

        return this.layout;
    }
});
