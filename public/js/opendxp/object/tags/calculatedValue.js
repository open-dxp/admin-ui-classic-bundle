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

opendxp.registerNS("opendxp.object.tags.calculatedValue");
/**
 * @private
 */
opendxp.object.tags.calculatedValue = Class.create(opendxp.object.tags.abstract, {

    type: "calculatedValue",

    initialize: function (data, fieldConfig) {
        this.data = data;
        this.fieldConfig = fieldConfig;

    },

    getLayoutEdit: function () {

        var input = {
            fieldLabel: '<img src="/bundles/opendxpadmin/img/flat-color-icons/calculator.svg" style="height: 1.8em; display: inline-block; vertical-align: middle;"/>' + this.fieldConfig.title,
            componentCls: this.getWrapperClassNames(),
            labelWidth: 100,
            readOnly: true,
            width: 100
        };

        if (this.data) {
            input.value = this.data.value;
        }

        if (this.fieldConfig.width) {
            input.width = this.fieldConfig.width;
        }

        if (!isNaN(this.fieldConfig.labelWidth) && this.fieldConfig.labelWidth) {
            input.labelWidth = this.fieldConfig.labelWidth;
        }

        if (this.fieldConfig.labelAlign) {
            input.labelAlign = this.fieldConfig.labelAlign;
        }

        if (!this.fieldConfig.labelAlign || 'left' === this.fieldConfig.labelAlign) {
            input.width = this.sumWidths(input.width, input.labelWidth);
        }

        if (this.data) {
            input.value = this.data;
        }

        if(this.fieldConfig.elementType === 'textarea') {
            this.component = new Ext.form.field.TextArea(input);
        } else if (this.fieldConfig.elementType === 'html') {
            this.component = new Ext.form.field.Display(input);
        } else if (this.fieldConfig.elementType === 'date') {
            this.component = new Ext.form.DateField(input);
        } else if(this.fieldConfig.elementType === 'boolean'){
            this.component = new Ext.form.field.Checkbox(input);
        } else {
            this.component = new Ext.form.field.Text(input);
        }

        return this.component;
    },

    getLayoutShow: function () {
        this.getLayoutEdit();
        this.component.setReadOnly(true);

        return this.component;
    },

    getValue: function () {
        return this.component.getValue();
    },

    getName: function () {
        return this.fieldConfig.name;
    },

    getGridColumnFilter: function (field) {
        if (['input', 'textarea', 'html'].some((val) => field.layout.elementType.includes(val))) {
            return {type: 'string', dataIndex: field.key};
        }
        return {type: field.layout.elementType, dataIndex: field.key};
    },

    getGridColumnConfig:function (field) {
        var renderer = function (key, value, metaData, record) {
            this.applyPermissionStyle(key, value, metaData, record);

            try {
                if (record.data.inheritedFields && record.data.inheritedFields[key] && record.data.inheritedFields[key].inherited == true) {
                    metaData.tdCls += " grid_value_inherited";
                }
            } catch (e) {
                console.log(e);
            }

            if (value && this.fieldConfig?.elementType === 'date') {
                if (!isNaN(+value)) {
                    const timestamp = parseInt(value) * 1000;
                    const date = new Date(timestamp);
                    return Ext.Date.format(date, opendxp.globalmanager.get('localeDateTime').getShortDateFormat());
                }
            } else if (this.fieldConfig?.elementType === 'boolean') {
                if (this.fieldConfig.calculatorType !== "expression") {
                    return value ? "true" : "false";
                } else {
                    return JSON.parse(value) ? "true" : "false";
                }
            }
            else if (value && (this.fieldConfig === undefined || this.fieldConfig.elementType !== 'html')) {
                value = value.toString().replace(/\n/g,"<br>");
                value = strip_tags(value, '<br>');
            }
            return value;
        }.bind(this, field.key);

        return {text: t(field.label), sortable:true, dataIndex:field.key, renderer:renderer,
            editor:this.getGridColumnEditor(field)};
    }
});
