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

opendxp.registerNS("opendxp.object.classes.data.booleanSelect");
/**
 * @private
 */
opendxp.object.classes.data.booleanSelect = Class.create(opendxp.object.classes.data.data, {

    type: "booleanSelect",
    /**
     * define where this datatype is allowed
     */
    allowIn: {
        object: true,
        objectbrick: true,
        fieldcollection: true,
        localizedfield: true,
        classificationstore : true,
        block: true,
        encryptedField: true
    },

    initialize: function (treeNode, initData) {
        this.type = "booleanSelect";

        this.initData(initData);

        if (typeof this.datax.yesLabel == "undefined") {
            this.datax.yesLabel = "yes";
        }

        if (typeof this.datax.noLabel == "undefined") {
            this.datax.noLabel = "no";
        }

        if (typeof this.datax.emptyLabel == "undefined") {
            this.datax.emptyLabel = "empty";
        }


        this.treeNode = treeNode;
    },

    getTypeName: function () {
        return t("boolean_select");
    },

    getGroup: function () {
        return "select";
    },

    getIconClass: function () {
        return "opendxp_icon_booleanSelect";
    },

    getLayout: function ($super) {

        if(typeof this.datax.options != "object") {
            this.datax.options = [];
        }

        $super();

        this.mandatoryCheckbox.disable();

        this.specificPanel.removeAll();
        var specificItems = this.getSpecificPanelItems(this.datax);
        this.specificPanel.add(specificItems);

        return this.layout;
    },

    getSpecificPanelItems: function (datax, inEncryptedField) {
        const stylingItems = [
            {
                xtype: "textfield",
                fieldLabel: t("width"),
                name: "width",
                value: datax.width
            },
            {
                xtype: "displayfield",
                hideLabel: true,
                value: t('width_explanation')
            }
        ];

        if (this.isInCustomLayoutEditor()) {
            return stylingItems;
        }

        return stylingItems.concat([
            {
                xtype: "textfield",
                fieldLabel: t("yes_label"),
                name: "yesLabel",
                value: datax.yesLabel
            },
            {
                xtype: "textfield",
                fieldLabel: t("no_label"),
                name: "noLabel",
                value: datax.noLabel
            },
            {
                xtype: "textfield",
                fieldLabel: t("empty_label"),
                name: "emptyLabel",
                value: datax.emptyLabel
            }
        ]);

    },

    applyData: function ($super) {
        $super();
    },

    applySpecialData: function(source) {
        if (source.datax) {
            if (!this.datax) {
                this.datax =  {};
            }
            Ext.apply(this.datax,
                {
                    options: source.datax.options,
                    width: source.datax.width,
                    yesLabel: source.datax.yesLabel,
                    noLabel: source.datax.noLabel,
                    emptyLabel: source.datax.emptyLabel
                });
        }
    }
});
