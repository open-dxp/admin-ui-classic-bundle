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

opendxp.registerNS("opendxp.object.classes.data.slider");
/**
 * @private
 */
opendxp.object.classes.data.slider = Class.create(opendxp.object.classes.data.data, {

    type: "slider",
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
        this.type = "slider";

        this.initData(initData);

        // overwrite default settings
        this.availableSettingsFields = ["name","title","tooltip", "mandatory", "noteditable","invisible","visibleGridView",
                                        "visibleSearch","index","style"];

        this.treeNode = treeNode;
    },

    getTypeName: function () {
        return t("slider");
    },

    getGroup: function () {
            return "numeric";
    },

    getIconClass: function () {
        return "opendxp_icon_slider";
    },

    getLayout: function ($super) {

        $super();

        this.specificPanel.removeAll();
        var specificItems = this.getSpecificPanelItems(this.datax, false);
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
            },
            {
                xtype: "textfield",
                fieldLabel: t("height"),
                name: "height",
                decimalPrecision: 0,
                value: datax.height
            },
            {
                xtype: "displayfield",
                hideLabel: true,
                value: t('height_explanation')
            }
        ];

        if (this.isInCustomLayoutEditor()) {
            return stylingItems;
        }

        return stylingItems.concat([
            {
                xtype: "numberfield",
                fieldLabel: t("min_value"),
                name: "minValue",
                value: datax.minValue,
                disabled: this.isInCustomLayoutEditor()
            },
            {
                xtype: "numberfield",
                fieldLabel: t("max_value"),
                name: "maxValue",
                value: datax.maxValue,
                disabled: this.isInCustomLayoutEditor()
            },
            {
                xtype: "numberfield",
                fieldLabel: t("increment"),
                name: "increment",
                value: datax.increment,
                disabled: this.isInCustomLayoutEditor()
            },
            {
                xtype: "numberfield",
                fieldLabel: t("decimalPrecision"),
                name: "decimalPrecision",
                decimalPrecision: 0,
                value: datax.decimalPrecision,
                disabled: this.isInCustomLayoutEditor()
            },
            {
                xtype: "checkbox",
                fieldLabel: t("vertical"),
                name: "vertical",
                checked: datax.vertical
            }
        ]);
    },

    applySpecialData: function(source) {
        if (source.datax) {
            if (!this.datax) {
                this.datax =  {};
            }
            Ext.apply(this.datax,
                {
                    width: source.datax.width,
                    height: source.datax.height,
                    minValue: source.datax.minValue,
                    maxValue: source.datax.maxValue,
                    vertical: source.datax.vertical,
                    increment: source.datax.increment,
                    decimalPrecision: source.datax.decimalPrecision
                });
        }
    }

});
