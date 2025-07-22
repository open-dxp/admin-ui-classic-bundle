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

opendxp.registerNS("opendxp.document.editables.numeric");
/**
 * @private
 */
opendxp.document.editables.numeric = Class.create(opendxp.document.editable, {

    initialize: function($super, id, name, config, data, inherited) {
        $super(id, name, config, data, inherited);

        if ('number' !== typeof data && !data) {
            data = "";
        }

        this.config.value = data;
        this.config.name = id + "_editable";
        this.config.decimalPrecision = config.decimalPrecision ?? 20;
        this.config.mouseWheelEnabled = false;

        if(this.config["required"]) {
            this.required = this.config["required"];
        }
    },

    render: function () {
        this.setupWrapper();
        this.element = new Ext.form.field.Number(this.config);
        this.element.render(this.id);

        this.checkValue();
        this.element.on("blur", this.checkValue.bind(this, true));
    },

    getValue: function () {
        if(this.element) {
            return this.element.getValue();
        }

        return this.config.value;
    },

    getType: function () {
        return "numeric";
    },

    checkValue: function (mark) {
        var value = this.getValue();

        if(Number(value) < 1) {
            this.element.addCls("empty");
        } else {
            this.element.removeCls("empty");
        }

        if (this.required) {
            this.validateRequiredValue(value, this.element, this, mark);
        }
    }
});
