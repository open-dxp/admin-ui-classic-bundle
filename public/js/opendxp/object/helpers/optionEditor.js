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


/**
 * NOTE: This helper-methods are added to the classes opendxp.object.edit, opendxp.object.fieldcollection,
 * opendxp.object.tags.localizedfields
 */

opendxp.registerNS("opendxp.object.helpers.optionEditor");
/**
 * @private
 */
opendxp.object.helpers.optionEditor = Class.create({

    initialize: function (store) {
        this.store = store;
    },

    edit: function() {

        var displayField = {
            xtype: "displayfield",
            region: "north",
            hideLabel: true,
            value: t('csv_separated_options_info')
        };


        var data = [];
        this.store.each(function (rec) {
                data.push([rec.get("key"), rec.get("value")]);
            }
        );

        data = Ext.util.CSV.encode(data);

        this.textarea = new Ext.form.TextArea({
            region: "center",
            value: data
        });

        this.configPanel = new Ext.Panel({
            layout: "border",
            padding: 20,
            items: [displayField, this.textarea]
        });


        this.window = new Ext.Window({
            width: 800,
            height: 500,
            title: t('csv_separated_options'),
            iconCls: "opendxp_icon_edit",
            layout: "fit",
            closeAction:'close',
            plain: true,
            maximized: false,
            modal: true,
            buttons: [
                {
                    text: t('apply'),
                    iconCls: "opendxp_icon_save",
                    handler: function(){
                        this.store.removeAll();
                        var content = this.textarea.getValue();
                        if (content.length > 0) {
                           var csvData = Ext.util.CSV.decode(content);

                            for(var i = 0;i < csvData.length;i++){
                                var pair = csvData[i];
                                var key = pair[0];
                                var value = pair[1];

                                if(!value) {
                                    value = key;
                                }

                                var u = {
                                    key: key,
                                    value: value
                                };
                                this.store.add(u);
                            }
                        }

                        this.window.hide();
                        this.window.destroy();
                    }.bind(this)
                },
                {
                    text: t('cancel'),
                    iconCls: "opendxp_icon_empty",
                    handler: function(){
                        this.window.hide();
                        this.window.destroy();
                    }.bind(this)
                }
            ]
        });

        this.window.add(this.configPanel);
        this.window.show();
    }
});
