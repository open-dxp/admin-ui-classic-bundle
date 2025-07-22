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

opendxp.registerNS("opendxp.element.metainfo");
/**
 * @private
 */
opendxp.element.metainfo = Class.create({
    getClassName: function (){
        return "opendxp.element.metainfo";
    },

    initialize: function (data, elementType) {
        this.data = data;
        this.elementType = elementType;

        this.getInputWindow();
        this.detailWindow.show();
    },


    getInputWindow: function () {

        if(!this.detailWindow) {
            var height = this.data.length > 8 ? 550 : 500;
            this.detailWindow = new Ext.Window({
                width: 800,
                height: height,
                iconCls: "opendxp_icon_info",
                layout: "fit",
                closeAction:'close',
                plain: true,
                autoScroll: true,
                modal: true,
                buttons: [
                    {
                        text: t('close'),
                        iconCls: "opendxp_icon_cancel",
                        handler: function(){
                            this.detailWindow.hide();
                            this.detailWindow.destroy();
                        }.bind(this)
                    }
                ]
            });

            this.createPanel();
        }
        return this.detailWindow;
    },


    createPanel: function() {
        var items = [];

        for (var i=0; i<this.data.length; i++) {

            var item;

            if(this.data[i]["type"] == "date") {
                item = {
                    xtype: "textfield",
                    fieldLabel: t(this.data[i]["name"]),
                    readOnly: true,
                    value: new Date(this.data[i]["value"] * 1000) + " (" + this.data[i]["value"] + ")",
                    width: 730
                };
            } else {
                var type = this.data[i]["type"];
                var value = this.data[i]["value"];
                var name = t(this.data[i]["name"]);
                if (type == "user") {

                    var htmlValue = value;
                    var user = opendxp.globalmanager.get("user");
                    var userUnknown = (htmlValue.search(t('user_unknown')) == -1) ? false : true;
                    var userSystem = (htmlValue.search('data-uid="0"') == -1) ? false : true;

                    if (user.admin && !userUnknown && !userSystem) {
                        htmlValue = value + " " + '<a href="#">' + t("click_to_open") +  '</a>';
                    }

                    item = {
                        xtype: "displayfield",
                        fieldLabel: name,
                        readOnly: true,
                        value: htmlValue,
                        width: 730
                    };
                    if (user.admin && !userUnknown && !userSystem) {
                        item.listeners = {
                            render: function(value, detailWindow, c){
                                c.getEl().on('click', function(){
                                    var inputId = c.getInputId();
                                    opendxp.helpers.showUser(Ext.get(inputId).child('span').getAttribute('data-uid'));
                                    detailWindow.close();
                                }, c);
                            }.bind(this, value, this.detailWindow)
                        };
                    }

                } else {

                    item = {
                        xtype: "textfield",
                        fieldLabel: name,
                        readOnly: true,
                        value: value,
                        width: 730
                    };
                }
            }
            items.push(item);
        }

        var panel = new Ext.form.FormPanel({
            border: false,
            frame:false,
            bodyStyle: 'padding:10px',
            items: items,
            defaults: {
                labelWidth: 130
            },
            collapsible: false,
            autoScroll: true
        });

        this.detailWindow.add(panel);
    }

});