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

opendxp.registerNS("opendxp.document.editables.select");
/**
 * @private
 */
opendxp.document.editables.select = Class.create(opendxp.document.editable, {

    initialize: function($super, id, name, config, data, inherited) {
        $super(id, name, config, data, inherited);

        this.config.listeners = {};

        // onchange event
        if (this.config.onchange) {
            this.config.listeners.select = eval(config.onchange);
        }

        if (this.config["reload"]) {
            this.config.listeners.select = this.reloadDocument;
        }

        if(typeof this.config["defaultValue"] !== "undefined" && data === null) {
            data = this.config["defaultValue"];
        }

        this.config.name = id + "_editable";
        this.config.triggerAction = 'all';
        this.config.editable = config.editable ? config.editable : false;
        this.config.value = data;
    },

    render: function() {
        this.setupWrapper();

        if (this.config["required"]) {
            this.required = this.config["required"];
        }

        this.element = new Ext.form.ComboBox(this.config);
        this.element.render(this.id);

        this.element.on("select", this.checkValue.bind(this, true));
        this.checkValue();
    },

    checkValue: function (mark) {
        var value = this.getValue();

        if (this.required) {
            this.validateRequiredValue(value, this.element, this, mark);
        }
    },

    getValue: function () {
        if(this.element) {
            return this.element.getValue();
        }

        return this.config.value;
    },

    getType: function () {
        return "select";
    }
});
