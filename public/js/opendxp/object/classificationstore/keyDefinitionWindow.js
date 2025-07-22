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

opendxp.registerNS("opendxp.object.classificationstore.keyDefinitionWindow");
/**
 * @private
 */
opendxp.object.classificationstore.keyDefinitionWindow = Class.create({

    initialize: function (data, keyid, parentPanel) {
        if (data) {
            this.data = data;
        } else {
            this.data = {};
        }

        this.parentPanel = parentPanel;
        this.keyid = keyid;
    },


    show: function() {

        var fieldtype = this.data.fieldtype;
        this.editor = new opendxp.object.classes.data[fieldtype](null, this.data);
        this.editor.setInClassificationStoreEditor(true);
        var layout = this.editor.getLayout();

        var invisibleFields = ["invisible","visibleGridView","visibleSearch","index"];
        var invisibleField;
        for(var f=0; f<invisibleFields.length; f++) {
            invisibleField = layout.getComponent("standardSettings").getComponent(invisibleFields[f]);
            if(invisibleField) {
                invisibleField.hide();
            }
        }

        this.window = new Ext.Window({
            modal: true,
            width: 800,
            height: 600,
            resizable: true,
            scrollable: "y",
            title: t("classificationstore_detailed_config"),
            items: [layout],
            bbar: [
            "->",{
                xtype: "button",
                text: t("cancel"),
                iconCls: "opendxp_icon_cancel",
                handler: function () {
                    this.window.close();
                }.bind(this)
            },{
                xtype: "button",
                text: t("apply"),
                iconCls: "opendxp_icon_apply",
                handler: function () {
                    this.applyData();
                }.bind(this)
            }],
            plain: true
        });

        this.window.show();
    },

    applyData: function() {

        this.editor.applyData();
        var definition = this.editor.getData();
        this.parentPanel.applyDetailedConfig(this.keyid, definition);
        this.window.close();
    }

});