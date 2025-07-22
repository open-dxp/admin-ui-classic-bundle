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

opendxp.registerNS("opendxp.object.tags.textarea");
/**
 * @private
 */
opendxp.object.tags.textarea = Class.create(opendxp.object.tags.abstract, {

    type: "textarea",

    initialize: function (data, fieldConfig) {
        this.data = data;
        this.fieldConfig = fieldConfig;

    },

    getGridColumnEditor: function(field) {
        if (field.layout.noteditable) {
            return null;
        }

        // TEXTAREA
        if (field.type == 'textarea') {
            const editorConfig = this.initEditorConfig(field);

            return new Ext.form.TextArea(editorConfig);
        }
    },

    getGridColumnFilter: function(field) {
        return {type: 'string', dataIndex: field.key};
    },

    getLayoutEdit: function () {
        if (!this.fieldConfig.width) {
            this.fieldConfig.width = 250;
        }
        if (!this.fieldConfig.height) {
            this.fieldConfig.height = 250;
        }

        var labelWidth = this.fieldConfig.labelWidth ? this.fieldConfig.labelWidth : 100;

        var conf = {
            name: this.fieldConfig.name,
            width: this.fieldConfig.width,
            height: this.fieldConfig.height,
            fieldLabel: this.fieldConfig.title,
            labelWidth: labelWidth
        };

        if (!this.fieldConfig.showCharCount) {
            conf.componentCls = this.getWrapperClassNames();
        }

        if (this.fieldConfig.labelAlign) {
            conf.labelAlign = this.fieldConfig.labelAlign;
        }

        if (!this.fieldConfig.labelAlign || 'left' === this.fieldConfig.labelAlign) {
            conf.width = this.sumWidths(conf.width, conf.labelWidth);
        }

        if (this.data) {
            conf.value = this.data;
        }
        if(this.fieldConfig.maxLength) {
            conf.maxLength = this.fieldConfig.maxLength;
            conf.enforceMaxLength = true;
        }

        this.component = new Ext.form.TextArea(conf);

        if(this.fieldConfig.showCharCount) {
            var charCount = Ext.create("Ext.Panel", {
                bodyStyle: '',
                margin: '0 0 0 0',
                bodyCls: 'char_count',
                width: conf.width,
                height: 17
            });

            this.component.setStyle("margin-bottom", "0");
            this.component.addListener("change", function(charCount) {
                this.updateCharCount(this.component, charCount);
            }.bind(this, charCount));

            //init word count
            this.updateCharCount(this.component, charCount);

            return Ext.create("Ext.Panel", {
                cls: "object_field object_field_type_" + this.type,
                style: "margin-bottom: 10px",
                layout: {
                    type: 'vbox',
                    align: 'left'
                },
                items: [
                    this.component,
                    charCount
                ]
            });

        } else {
            return this.component;
        }
    },

    updateCharCount: function(textField, charCount) {
        if( this.fieldConfig.maxLength) {
            charCount.setHtml(textField.getValue().length + "/" + this.fieldConfig.maxLength);
        } else {
            charCount.setHtml(textField.getValue().length);
        }
    },


    getLayoutShow: function () {
        var layout = this.getLayoutEdit();
        this.component.setReadOnly(true);
        return layout;
    },

    getValue: function () {
        return this.component.getValue();
    },

    getName: function () {
        return this.fieldConfig.name;
    }
});
