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

opendxp.registerNS("opendxp.asset.metadata.tags.checkbox");
/**
 * @private
 */
opendxp.asset.metadata.tags.checkbox = Class.create(opendxp.asset.metadata.tags.abstract, {

    type:"checkbox",

    initialize:function (data, fieldConfig) {
        this.data = "";

        if (data) {
            this.data = data;
        }
        this.fieldConfig = fieldConfig;
    },

    getGridColumnConfig:function (field) {
        var columnConfig = new Ext.grid.column.Check({
            text:  field.label,
            editable: false,
            width: this.getColumnWidth(field, 40),
            sortable: false,
            filter: this.getGridColumnFilter(field),
            dataIndex: field.key,
        });

        return columnConfig;
    },

    getGridColumnFilter:function (field) {
        return {type:'boolean', dataIndex:field.key};
    },

    getLayoutEdit:function () {
        var checkbox = {
            name:this.fieldConfig.name,
            value: this.data,
            width: 25,
            handler: function (checkbox, checked) {
                this.dataChanged = true;
                this.data = this.checkbox.getValue();
            }.bind(this),
        };

        if (this.fieldConfig.labelWidth) {
            checkbox.labelWidth = this.fieldConfig.labelWidth;
        }

        this.checkbox = new Ext.form.Checkbox(checkbox);

        var componentCfg = {
            fieldLabel:this.fieldConfig.title,
            layout: 'fit',
            items: this.checkbox,
            componentCls: "object_field",
            border: false,
            style: {
                padding: 0
            }
        };

        this.component = Ext.create('Ext.form.FieldContainer', componentCfg);

        return this.component;
    },

    getLayoutShow:function () {
        this.component = this.getLayoutEdit();
        this.component.disable();

        return this.component;
    },

    getValue:function () {
        return this.data;
    },

    getName:function () {
        return this.fieldConfig.name;
    },

    isDirty:function () {
        return this.dataChanged;
    },

    getGridCellRenderer: function(value, metaData, record, rowIndex, colIndex, store) {
        if (value) {
            return '<div style="text-align: left"><div role="button" class="x-grid-checkcolumn x-grid-checkcolumn-checked" style=""></div></div>';
        } else {
            return '<div style="text-align: left"><div role="button" class="x-grid-checkcolumn" style=""></div></div>';
        }
    },

    handleGridCellClick: function(grid, cell, rowIndex, cellIndex, e) {
        var store = grid.getStore();
        var record = store.getAt(rowIndex);
        record.set("data", !record.data.data);
    }

});
