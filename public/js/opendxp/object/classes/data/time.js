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

opendxp.registerNS("opendxp.object.classes.data.time");
/**
 * @private
 */
opendxp.object.classes.data.time = Class.create(opendxp.object.classes.data.data, {

    type: "time",
    dateFormat: "H:i",

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
        this.type = "time";

        this.initData(initData);

        this.treeNode = treeNode;
    },

    formatTime: function(value) {
        return Ext.Date.format(value, this.dateFormat);
    },

    getLayout: function ($super) {

        $super();
        this.specificPanel.removeAll();

        const widthItems = this.getWidthPanelItems(this.datax);
        this.specificPanel.add(widthItems);

        var specificItems = this.getSpecificPanelItems(this.datax);
        this.specificPanel.add(specificItems);


        return this.layout;
    },

    getSpecificPanelItems: function (datax, inEncryptedField) {

        let specificItems = [];

        if (!this.isInCustomLayoutEditor()) {
            let minmaxSet;
            const onMinMaxValueChange = function() {

                const minValueSelector = minmaxSet.getComponent('minTime'),
                    maxValueSelector = minmaxSet.getComponent('maxTime'),
                    minValue = (minValueSelector.getValue()) ? opendxp.object.classes.data.time.prototype.formatTime(minValueSelector.getValue()) : null,
                    maxValue = (maxValueSelector.getValue()) ? opendxp.object.classes.data.time.prototype.formatTime(maxValueSelector.getValue()) : null;

                minValueSelector.setMaxValue(maxValue);
                maxValueSelector.setMinValue(minValue);
            };

            minmaxSet = new Ext.form.FieldSet({
                xtype: 'fieldset',
                style: 'margin-top:10px',
                title: t('min_max_times'),
                items: [
                    {
                        xtype: "numberfield",
                        itemId: 'increment',
                        fieldLabel: t("increment"),
                        width: 200,
                        name: "increment",
                        value: datax.increment ? datax.increment : 15
                    },
                    {
                        xtype: 'timefield',
                        itemId: 'minTime',
                        fieldLabel: t('min_value'),
                        format: opendxp.object.classes.data.time.prototype.dateFormat,
                        editable: false,
                        width: 200,
                        value: datax.minValue,
                        componentCls: "object_field",
                        name: 'minValue',
                        listeners: {
                            change: onMinMaxValueChange
                        }
                    },
                    {
                        xtype: 'timefield',
                        itemId: 'maxTime',
                        fieldLabel: t('max_value'),
                        format: opendxp.object.classes.data.time.prototype.dateFormat,
                        editable: false,
                        width: 200,
                        value: datax.maxValue,
                        componentCls: "object_field",
                        name: 'maxValue',
                        listeners: {
                            change: onMinMaxValueChange
                        }
                    },
                    {
                        xtype: 'button',
                        text: t('reset'),
                        handler: function() {
                            minmaxSet.getComponent('increment').setValue(15);
                            minmaxSet.getComponent('minTime').setValue(null);
                            minmaxSet.getComponent('maxTime').setValue(null);
                        }
                    }
                ]
            });

            specificItems = [minmaxSet];
            //init the values
            onMinMaxValueChange();
        }

        return specificItems;


    },

    getWidthPanelItems: function (datax) {
        return [{
            xtype: "textfield",
            fieldLabel: t("width"),
            name: "width",
            value: datax.width
        }];
    },

    applySpecialData: function(source) {
        if (source.datax) {
            if (!this.datax) {
                this.datax =  {};
            }
            Ext.apply(this.datax,
                {
                    minValue: source.datax.minValue,
                    maxValue: source.datax.maxValue,
                    increment: source.datax.increment
                });
        }
    },

    getTypeName: function () {
        return t("time");
    },

    getGroup: function () {
            return "date";
    },

    getIconClass: function () {
        return "opendxp_icon_time";
    }

});
