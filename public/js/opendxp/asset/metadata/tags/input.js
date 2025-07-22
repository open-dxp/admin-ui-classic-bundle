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

opendxp.registerNS("opendxp.asset.metadata.tags.input");
/**
 * @private
 */
opendxp.asset.metadata.tags.input = Class.create(opendxp.asset.metadata.tags.abstract, {

    type: "input",

    initialize: function (data, fieldConfig) {

        this.data = "";

        if (data) {
            this.data = data;
        }
        this.fieldConfig = fieldConfig;
    },

    getGridColumnEditor: function(field) {
        const editorConfig = this.initEditorConfig(field);

        return new Ext.form.TextField(editorConfig);
    },

    getGridColumnFilter: function(field) {
        return {type: 'string', dataIndex: field.key};
    },

    getLayoutEdit: function () {

        var input = {
            fieldLabel: this.fieldConfig.title,
            name: this.fieldConfig.name,
            componentCls: "object_field",
            labelWidth: 100
        };

        if (this.data) {
            input.value = this.data;
        }

        if (this.fieldConfig.width) {
            input.width = this.fieldConfig.width;
        } else {
            input.width = 250;
        }

        if (this.fieldConfig.labelWidth) {
            input.labelWidth = this.fieldConfig.labelWidth;
        }
        input.width += input.labelWidth;

        if(this.fieldConfig.columnLength) {
            input.maxLength = this.fieldConfig.columnLength;
            input.enforceMaxLength = true;
        }

        this.component = new Ext.form.TextField(input);

        return this.component;

    },

    getValue: function () {
        return this.component.getValue();
    },

    getName: function () {
        return this.fieldConfig.name;
    },

    getGridCellEditor: function (gridtype, record) {
        return Ext.create('Ext.form.TextField');
    }
});
