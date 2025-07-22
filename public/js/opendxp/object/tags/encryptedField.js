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

opendxp.registerNS("opendxp.object.tags.encryptedField");
/**
 * @private
 */
opendxp.object.tags.encryptedField = Class.create(opendxp.object.tags.abstract, {

    type: "encryptedField",

    initialize: function (data, fieldConfig) {

        if (typeof opendxp.object.tags[fieldConfig.delegateDatatype] !== "undefined") {
            var delegateFieldConfig = fieldConfig.delegate || {};
            delegateFieldConfig.labelWidth = fieldConfig.labelWidth;
            delegateFieldConfig.labelAlign = fieldConfig.labelAlign;
            this.delegate = new opendxp.object.tags[fieldConfig.delegateDatatype](data, delegateFieldConfig);
        }
        this.fieldConfig = fieldConfig;
    },

    getGridColumnConfig: function (field) {

        if (typeof opendxp.object.tags[field.layout.delegateDatatype] !== "undefined") {
            return opendxp.object.tags[field.layout.delegateDatatype].prototype.getGridColumnConfig(this.getDelegateGridConfig(field));
        } else {
            return {text: t(field.label), width: 150, sortable: false};
        }
    },

    getDelegateGridConfig: function(field) {
        var delegateConfig = {
            layout: field.layout.delegate || {},
            type: field.delegateDatatype,
            key: field.key,
            label: field.label
        }
        return delegateConfig;
    },

    getCellEditValue: function () {
        return this.delegate.getCellEditValue();
    },

    getGridColumnEditor: function (field) {

        return opendxp.object.tags[field.layout.delegateDatatype].prototype.getGridColumnEditor(this.getDelegateGridConfig(field));
    },

    getGridColumnFilter: function (field) {
        return null;
    },

    getLayoutEdit: function () {
        if (this.delegate) {
            this.component = this.delegate.getLayoutEdit();
            return this.component;
        }
    },

    getLayoutShow: function () {
        if (this.delegate) {
            this.component = this.delegate.getLayoutShow();
            return this.component;
        }
    },

    getValue: function () {
        return this.delegate.getValue();
    },

    getName: function () {
        return this.fieldConfig.name;
    },

    isDirty: function () {
        return this.delegate.isDirty();
    }
});
