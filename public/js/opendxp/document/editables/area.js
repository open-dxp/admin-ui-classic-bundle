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

opendxp.registerNS("opendxp.document.editables.area");
/**
 * @private
 */
opendxp.document.editables.area = Class.create(opendxp.document.area_abstract, {

    initialize: function($super, id, name, config, data, inherited) {
        $super(id, name, config, data, inherited);

        this.datax = data ?? {};

        //editable dialog box button
        try {
            var dialogBoxDiv = Ext.get(id).query('.opendxp_area_dialog[data-name="' + this.name + '"]')[0];
            if (dialogBoxDiv) {
                var dialogBoxButton = new Ext.Button({
                    cls: "opendxp_block_button_dialog",
                    iconCls: "opendxp_icon_white_edit",
                    listeners: {
                        "click": this.openEditableDialogBox.bind(this, Ext.get(id), dialogBoxDiv)
                    }
                });
                dialogBoxButton.render(dialogBoxDiv);
            }
        } catch (e) {
            console.log(e);
        }

    },

    setInherited: function ($super, inherited) {
        // disable masking for this datatype (overwrite), because it's actually not needed, otherwise call $super()
        this.inherited = inherited;
    },

    getValue: function () {
        if(this.config['type'] !== undefined){
            this.datax['type'] = this.config['type'];
        }

        return this.datax;
    },

    getType: function () {
        return "area";
    }
});