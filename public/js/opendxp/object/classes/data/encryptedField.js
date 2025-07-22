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

opendxp.registerNS("opendxp.object.classes.data.encryptedField");
/**
 * @private
 */
opendxp.object.classes.data.encryptedField = Class.create(opendxp.object.classes.data.data, {

    type: "encryptedField",
    /**
     * define where this datatype is allowed
     */
    allowIn: {
        object: true,
        objectbrick: true,
        fieldcollection: true,
        localizedfield: true,
        classificationstore: true,
        block: true
    },

    initialize: function (treeNode, initData) {
        this.type = "encryptedField";

        this.initData(initData);
        this.history = {};

        if (!this.datax.delegateDatatype) {
            this.datax.delegateDatatype = "input";
        }

        this.history[this.datax.delegateDatatype] = Ext.decode(Ext.encode(this.datax));

        this.treeNode = treeNode;
    },

    getTypeName: function () {
        return t("encryptedField");
    },

    getGroup: function () {
        return "other";
    },

    getIconClass: function () {
        return "opendxp_icon_encryptedField";
    },


    rebuildDelegateSpecificItems: function () {
        var i;
        for (i = this.specificPanel.items.length - 1; i >= 1; i--) {

            var specificItem = this.specificPanel.items.getAt(i);

            if (specificItem != this.delegateTypeField) {

                this.specificPanel.remove(specificItem);
            }
        }

        if (this.datax.delegateDatatype) {
            if (typeof opendxp.object.classes.data[this.datax.delegateDatatype] !== "undefined" &&
                typeof opendxp.object.classes.data[this.datax.delegateDatatype].prototype.getSpecificPanelItems !== "undefined") {
                var specificDataX = this.datax.delegate || {};
                var delegateSpecificItems = opendxp.object.classes.data[this.datax.delegateDatatype].prototype.getSpecificPanelItems(specificDataX, true);
                this.specificPanel.add(delegateSpecificItems);
            }
        }

        this.specificPanel.updateLayout();
    },


    buildSpecificPanel: function () {
        this.specificPanel.removeAll();

        var internalTypeSelection = this.buildTypeSelectionCombo();
        this.specificPanel.add(internalTypeSelection);
        this.rebuildDelegateSpecificItems();
    }
    ,

    getLayout: function ($super) {
        $super();
        this.buildSpecificPanel();
        return this.layout;
    }
    ,

    applyData: function ($super) {

        if (typeof opendxp.object.classes.data[this.datax.delegateDatatype].prototype.applyData !== "undefined") {
            opendxp.object.classes.data[this.datax.delegateDatatype].prototype.applyData.call(this);
        } else {
            $super();
        }

        delete this.datax.delegate;
        this.datax.delegate = Ext.decode(Ext.encode(this.datax));
    },


    applySpecialData: function (source) {
        if (typeof opendxp.object.classes.data[this.datax.delegateDatatype].prototype.applySpecialData !== "undefined") {
            opendxp.object.classes.data[this.datax.delegateDatatype].prototype.applySpecialData.call(this, source);
        }

        delete this.datax.delegate;
        this.datax.delegate = Ext.decode(Ext.encode(this.datax));
    },

    buildTypeSelectionCombo: function () {

        var internalTypeData = [];

        var dataComps = Object.keys(opendxp.object.classes.data);

        for (var i = 0; i < dataComps.length; i++) {
            var dataComp = opendxp.object.classes.data[dataComps[i]];

            if ('object' !== typeof dataComp) {
                if (dataComp.prototype.allowIn['encryptedField']) {
                    internalTypeData.push([dataComps[i], t(dataComps[i])]);
                }
            }
        }

        this.delegateTypeField = new Ext.form.ComboBox({
            mode: 'local',
            autoSelect: true,
            forceSelection: true,
            editable: false,
            fieldLabel: t("datatype"),
            width: 500,
            name: "delegateDatatype",
            value: (typeof opendxp.object.classes.data[this.datax.delegateDatatype] !== "undefined") ? this.datax.delegateDatatype : 'input',
            store: new Ext.data.ArrayStore({
                fields: [
                    'id',
                    'label'
                ],
                sorters: ['label'],
                data: internalTypeData
            }),
            listeners: {
                change: function (combo, newValue, oldValue) {

                    this.applyData();

                    this.history[oldValue] = Ext.decode(Ext.encode(this.datax));
                    this.history[oldValue]["delegateDatatype"] = oldValue;

                    if (this.history[newValue]) {
                        // try to restore previous settings
                        this.datax = this.history[newValue];
                    } else {
                        this.datax = {
                            delegateDatatype: this.datax.delegateDatatype
                        };
                    }

                    this.rebuildDelegateSpecificItems();
                }.bind(this)
            },
            triggerAction: 'all',
            valueField: 'id',
            displayField: 'label'
        });

        return this.delegateTypeField;


    }
})
;
