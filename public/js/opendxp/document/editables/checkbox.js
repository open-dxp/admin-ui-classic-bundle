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

opendxp.registerNS("opendxp.document.editables.checkbox");
/**
 * @private
 */
opendxp.document.editables.checkbox = Class.create(opendxp.document.editable, {


    initialize: function($super, id, name, config, data, inherited) {
        $super(id, name, config, data, inherited);

        this.data = data ?? false;
    },

    render: function () {
        this.setupWrapper();
        this.htmlId = this.id + "_editable";

        var elContainer = Ext.get(this.id);

        var inputCheckbox = document.createElement("input");
        inputCheckbox.setAttribute('name', this.htmlId);
        inputCheckbox.setAttribute('type', 'checkbox');
        inputCheckbox.setAttribute('value', 'true');
        inputCheckbox.setAttribute('id', this.htmlId);
        if(this.data) {
            inputCheckbox.setAttribute('checked', 'checked');
        }

        elContainer.appendChild(inputCheckbox);

        if(this.config["label"]) {
            var labelCheckbox = document.createElement("label");
            labelCheckbox.setAttribute('for', this.htmlId);
            labelCheckbox.innerText = this.config["label"];
            elContainer.appendChild(labelCheckbox);
        }

        this.elComponent = Ext.get(this.htmlId);

        if (this.config.reload) {
            this.elComponent.on('change', this.reloadDocument);
        }
    },

    renderInDialogBox: function () {

        if(this.config['dialogBoxConfig'] &&
            (this.config['dialogBoxConfig']['label'] || this.config['dialogBoxConfig']['name'])) {
            this.config["label"] = this.config['dialogBoxConfig']['label'] ?? this.config['dialogBoxConfig']['name'];
        }

        this.render();
    },

    getValue: function () {
        if(this.elComponent) {
            return this.elComponent.dom.checked;
        }

        return this.data;
    },

    getType: function () {
        return "checkbox";
    }
});
