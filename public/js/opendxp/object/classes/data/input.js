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

opendxp.registerNS("opendxp.object.classes.data.input");
/**
 * @private
 */
opendxp.object.classes.data.input = Class.create(opendxp.object.classes.data.data, {

    type: "input",
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
        this.type = "input";

        this.initData(initData);

        this.treeNode = treeNode;
    },

    getTypeName: function () {
        return t("input");
    },

    getGroup: function () {
            return "text";
    },

    getIconClass: function () {
        return "opendxp_icon_input";
    },

    getLayout: function ($super) {

        $super();

        this.specificPanel.removeAll();
        var specificItems = this.getSpecificPanelItems(this.datax);
        this.specificPanel.add(specificItems);

        return this.layout;
    },

    getSpecificPanelItems: function (datax, inEncryptedField) {
        let specificItems = [];

        if (!this.isInCustomLayoutEditor()) {
            specificItems = [
                {
                    xtype: "textfield",
                    fieldLabel: t("default_value"),
                    name: "defaultValue",
                    value: datax.defaultValue,
                    width: 600
                },
                {
                    xtype: 'textfield',
                    width: 600,
                    fieldLabel: t("default_value_generator"),
                    labelWidth: 140,
                    name: 'defaultValueGenerator',
                    value: datax.defaultValueGenerator
                }
            ];
        }

        specificItems = specificItems.concat([
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
                xtype: "checkbox",
                fieldLabel: t("show_charcount"),
                name: "showCharCount",
                value: datax.showCharCount
            }
        ]);

        if (!this.isInCustomLayoutEditor() && !this.isInClassificationStoreEditor()) {

            if (!inEncryptedField) {
                specificItems.push({
                    xtype: "numberfield",
                    fieldLabel: t("columnlength"),
                    name: "columnLength",
                    value: datax.columnLength
                });
            }

            let regexSet;
            let checkRegex = function () {
                let testStringEl = regexSet.getComponent("regexTestString");
                let regex = regexSet.getComponent("regex").getValue();
                let regexFlag = regexSet.getComponent("regexflags").getValue().join("");
                let testString = testStringEl.getValue();

                try {
                    var regexp = new RegExp(regex, regexFlag);
                    if (regexp.test(testString)) {
                        testStringEl.addCls("class-editor-validation-success");
                        testStringEl.removeCls("class-editor-validation-error");
                    } else {
                        testStringEl.removeCls("class-editor-validation-success");
                        testStringEl.addCls("class-editor-validation-error");
                    }
                } catch (e) {
                    Ext.MessageBox.alert(t("error"), e);
                }
            };

            regexSet = new Ext.form.FieldSet({
                xtype: "fieldset",
                style: "margin-top:10px;",
                title: t("regex_validation"),
                items: [{
                    xtype: "textfield",
                    fieldLabel: t("regex"),
                    itemId: "regex",
                    name: "regex",
                    width: 400,
                    value: datax["regex"],
                    enableKeyEvents: true,
                    listeners: {
                        blur: checkRegex
                    }
                }, {
                    xtype: 'combobox',
                    multiSelect: true,
                    fieldLabel: t("regex_flags"),
                    itemId: "regexflags",
                    name: 'regexflags',
                    triggerAction: "all",
                    selectOnFocus: true,
                    forceSelection: true,
                    store: new Ext.data.ArrayStore({
                        fields: [
                            'value',
                            'key'
                        ],
                        data: [
                            ["g", t("global")],
                            ["i", t("ignoreCase")],
                            ["m", t("multiline")],
                            ["u", t("unicode")],
                            ["y", t("sticky")],
                        ]
                    }),
                    value: datax.defaultValue,
                    displayField: 'key',
                    valueField: 'value',
                    width: 300,
                    listeners: {
                        change: checkRegex
                    }
                }, {
                    xtype: "panel",
                    bodyStyle: "padding-top: 3px",
                    style: "margin-bottom: 10px",
                    html: '<span class="object_field_setting_warning">' + t('object_regex_info') + ' (Delimiter: #)</span>'
                }, {
                    xtype: "textfield",
                    fieldLabel: t("test_string"),
                    itemId: "regexTestString",
                    width: 400,
                    enableKeyEvents: true,
                    listeners: {
                        keyup: checkRegex
                    }
                }]
            });

            specificItems.push(regexSet);
        }

        return specificItems;

    },

    applySpecialData: function(source) {
        if (source.datax) {
            if (!this.datax) {
                this.datax =  {};
            }
            Ext.apply(this.datax,
                {
                    width: source.datax.width,
                    columnLength: source.datax.columnLength,
                    regex: source.datax.regex,
                    unique: source.datax.unique,
                    defaultValue: source.datax.defaultValue,
                    defaultValueGenerator: source.datax.defaultValueGenerator,
                    showCharCount : source.datax.showCharCount
                });
        }
    },

    supportsUnique: function() {
        return true;
    }
});
