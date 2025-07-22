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

opendxp.registerNS("opendxp.object.tags.time");
/**
 * @private
 */
opendxp.object.tags.time = Class.create(opendxp.object.tags.abstract, {

    type: "time",

    initialize: function (data, fieldConfig) {
        this.data = data;
        this.fieldConfig = fieldConfig;
    },

    getGridColumnFilter: function (field) {
        return {type: 'string', dataIndex: field.key};
    },

    getLayoutEdit: function () {
        const options = {
            fieldLabel: this.fieldConfig.title,
            format: "H:i",
            emptyText: "",
            width: this.fieldConfig.width ? this.fieldConfig.width : 200,
            value: this.data,
            allowBlank: (!this.fieldConfig.mandatory),
            minValue: (this.fieldConfig.minValue) ? this.fieldConfig.minValue : null,
            maxValue: (this.fieldConfig.maxValue) ? this.fieldConfig.maxValue : null,
            componentCls: this.getWrapperClassNames(),
            increment: (this.fieldConfig.increment) ? this.fieldConfig.increment : 15
        };
    
        if (this.fieldConfig.labelWidth) {
            options.labelWidth = this.fieldConfig.labelWidth;
        }

        if (!this.fieldConfig.labelAlign || 'left' === this.fieldConfig.labelAlign) {
            options.width = this.sumWidths(options.width, options.labelWidth);
        }

        this.component = new Ext.form.TimeField(options)

        return this.component;
    },

    getLayoutShow: function () {

        this.component = this.getLayoutEdit();
        this.component.setReadOnly(true);

        return this.component;
    },

    getValue: function () {
        const date = this.component.getValue();
        return Ext.Date.format(date, opendxp.globalmanager.get('localeDateTime').getShortTimeFormat());
    },

    getName: function () {
        return this.fieldConfig.name;
    },

    getGridColumnConfig: function (field) {
        var renderer = function (key, value, metaData, record) {
            this.applyPermissionStyle(key, value, metaData, record);

            try {
                if (record.data.inheritedFields && record.data.inheritedFields && record.data.inheritedFields[key] && record.data.inheritedFields[key].inherited == true) {
                    metaData.tdCls += " grid_value_inherited";
                }
            } catch (e) {
                console.log(e);
            }
            return value;

        }.bind(this, field.key);

        return {
            text: t(field.label), sortable: true, dataIndex: field.key, renderer: renderer,
            getEditor:this.getWindowCellEditor.bind(this, field)
        };
    },

    getCellEditValue: function () {
        return this.getValue();
    }

});
