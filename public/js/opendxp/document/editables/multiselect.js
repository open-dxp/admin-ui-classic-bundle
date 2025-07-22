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

opendxp.registerNS("opendxp.document.editables.multiselect");
/**
 * @private
 */
opendxp.document.editables.multiselect = Class.create(opendxp.document.editable, {

    initialize: function($super, id, name, config, data, inherited) {
        $super(id, name, config, data, inherited);

        this.data = data;

        this.config.name = id + "_editable";
        if(data) {
            this.config.value = data;
        }
        this.config.valueField = "id";

        this.config.listeners = {};

        if (this.config["reload"]) {
            this.config.listeners.change = this.reloadDocument;
        }

        if (typeof this.config.store !== "undefined") {
            this.config.store = Ext.create('Ext.data.ArrayStore', {
                fields: ['id', 'text'],
                data: this.config.store
            });
        }
    },

    render: function () {
        this.setupWrapper();
        this.element = Ext.create('Ext.ux.form.MultiSelect', this.config);
        this.element.render(this.id);
    },

    getValue: function () {
        if(this.element) {
            return this.element.getValue();
        }

        return this.data;
    },

    getType: function () {
        return "multiselect";
    }
});