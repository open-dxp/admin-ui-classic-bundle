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

opendxp.registerNS("opendxp.object.tags.country");
/**
 * @private
 */
opendxp.object.tags.country = Class.create(opendxp.object.tags.select, {

    type: "country",

    initialize: function (data, fieldConfig) {
        this.data = data;
        this.fieldConfig = fieldConfig;
        this.fieldConfig.width = this.fieldConfig.width || 300;
    },

    getGridColumnConfig:function (field) {
        var renderer = function (key, value, metaData, record) {
            if (value && Ext.isObject(value)) {
                value = value.value;
            }
            this.applyPermissionStyle(key, value, metaData, record);

            if (record.data.inheritedFields && record.data.inheritedFields[key] && record.data.inheritedFields[key].inherited == true) {
                try {
                    metaData.tdCls += " grid_value_inherited";
                } catch (e) {
                    console.log(e);
                }
            }

            for(var i=0; i < field.layout.options.length; i++) {
                if(field.layout.options[i]["value"] == value) {
                    return replace_html_event_attributes(strip_tags(field.layout.options[i]["key"], 'div,span,b,strong,em,i,small,sup,sub'));
                }
            }

            if (value) {
                return replace_html_event_attributes(strip_tags(value, 'div,span,b,strong,em,i,small,sup,sub'));
            }
        }.bind(this, field.key);

        return {
            text: t(field.label),
            sortable: true,
            dataIndex: field.key,
            renderer: renderer,
            editor: this.getGridColumnEditor(field)
        };
    }
});
