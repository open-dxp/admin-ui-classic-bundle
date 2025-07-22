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

opendxp.registerNS("opendxp.object.tags.date");
/**
 * @private
 */
opendxp.object.tags.date = Class.create(opendxp.object.tags.abstract, {

    type:"date",

    initialize:function (data, fieldConfig) {
        this.data = data;
        this.fieldConfig = fieldConfig;
    },

    applyDefaultValue: function() {
        this.defaultValue = null;

        if ((typeof this.data === "undefined" || this.data === null) && this.fieldConfig.defaultValue) {
            this.defaultValue = this.fieldConfig.defaultValue;
        } else if ((typeof this.data === "undefined" || this.data === null) && this.fieldConfig.useCurrentDate) {
            this.defaultValue = (new Date().getTime()) / 1000;
        }

        if(this.defaultValue) {
            this.data = this.defaultValue;
        }
    },

    getGridColumnConfig:function (field) {
        return {text: t(field.label), width:150, sortable:true, dataIndex:field.key,
            getEditor:this.getWindowCellEditor.bind(this, field),
            renderer:function (key, fieldConfig, value, metaData, record) {

                this.applyPermissionStyle(key, value, metaData, record);

                if (record.data.inheritedFields && record.data.inheritedFields[key] && record.data.inheritedFields[key].inherited == true) {
                    metaData.tdCls += " grid_value_inherited";
                }

                if (value) {
                    let date;
                    if (typeof value === "string" && value.match(/-/)) {
                        date = new Date(value);
                    } else {
                        let timestamp = intval(value) * 1000;
                        date = new Date(timestamp);

                        if (!this.isRespectTimezone(fieldConfig)) {
                            date = dateToServerTimezone(date);
                        }
                    }

                    return Ext.Date.format(date, opendxp.globalmanager.get('localeDateTime').getShortDateFormat());
                }
                return "";
            }.bind(this, field.key, field.layout)};
    },

    getGridColumnFilter:function (field) {
        return {type:'date', dataIndex:field.key, dateFormat: field.layout.columnType === "date" ? 'Y-m-d' : "c"};
    },

    getLayoutEdit:function () {

        var date = {
            fieldLabel:this.fieldConfig.title,
            name:this.fieldConfig.name,
            componentCls: this.getWrapperClassNames(),
            width:130,
        };

        if (this.fieldConfig.labelWidth) {
            date.labelWidth = this.fieldConfig.labelWidth;
        }

        if (this.fieldConfig.labelAlign) {
            date.labelAlign = this.fieldConfig.labelAlign;
        }

        if (!this.fieldConfig.labelAlign || 'left' === this.fieldConfig.labelAlign) {
            date.width = this.sumWidths(date.width, date.labelWidth);
        }

        if (this.data) {
            var tmpDate = new Date(intval(this.data) * 1000);

            if (!this.isRespectTimezone()) {
                tmpDate = dateToServerTimezone(tmpDate);
            }

            date.value = tmpDate;
        }

        this.component = new Ext.form.DateField(date);
        return this.component;
    },

    getLayoutShow:function () {

        this.component = this.getLayoutEdit();
        this.component.setReadOnly(true);

        return this.component;
    },

    getValue:function () {
        if (this.component.getValue()) {
            let value = this.component.getValue();
            if(value && this.fieldConfig.columnType === "date") {
                return Ext.Date.format(value, "Y-m-d");
            }
            if (value && typeof value.getTime == "function") {
                return value.getTime();
            } else {
                return value;
            }
        }
        return false;
    },

    getCellEditValue: function () {
        if (this.fieldConfig.columnType === "date") {
            return this.getValue();
        }
        return this.getValue() / 1000;
    },

    getName:function () {
        return this.fieldConfig.name;
    },

    isDirty:function () {
        var dirty = false;

        if(this.defaultValue){
            return true;
        }

        if (this.component && typeof this.component.isDirty == "function") {
            if (this.component.rendered) {
                dirty = this.component.isDirty();

                // once a field is dirty it should be always dirty (not an ExtJS behavior)
                if (this.component["__opendxp_dirty"]) {
                    dirty = true;
                }
                if (dirty) {
                    this.component["__opendxp_dirty"] = true;
                }

                return dirty;
            }
        }

        return false;
    },

    isRespectTimezone: function(fieldConfig) {
        fieldConfig = fieldConfig || this.fieldConfig;
        return fieldConfig && fieldConfig.columnType !== "date";
    }

});
