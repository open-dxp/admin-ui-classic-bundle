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

opendxp.registerNS("opendxp.settings.gdpr.gdprPanel");
/**
 * @private
 */
opendxp.settings.gdpr.gdprPanel = Class.create({

    initialize: function () {
        this.getPanel();
    },

    getPanel: function () {

        var tabPanel = Ext.getCmp("opendxp_panel_tabs");

        if(!this.panel) {

            this.panel = new Ext.Panel({
                title: t("gdpr_data_extractor"),
                layout: "border",
                iconCls: "opendxp_icon_gdpr",
                closable: true,
                items: [
                    this.getSearchPanel(),
                    this.getTabPanel()
                ]
            });

            tabPanel.add(this.panel);
        }

        tabPanel.setActiveTab(this.panel);

        return this.panel;
    },


    getSearchPanel: function() {

        this.formPanel = Ext.create('Ext.form.Panel', {
            region: "north",
            bodyStyle: "padding: 10px;",
            items: [
                {
                    xtype: 'textfield',
                    name: 'id',
                    fieldLabel: t("gdpr_data_extractor_label_id"),
                    width: 650
                },
                {
                    xtype: 'textfield',
                    name: 'firstname',
                    fieldLabel: t("gdpr_data_extractor_label_firstname"),
                    width: 650
                },
                {
                    xtype: 'textfield',
                    name: 'lastname',
                    fieldLabel: t("gdpr_data_extractor_label_lastname"),
                    width: 650
                },
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'email',
                            fieldLabel: t("gdpr_data_extractor_label_email"),
                            width: 650,
                            validator: function (value) {
                                if(value !== value.replace(/[^a-zA-Z0-9_\-@.]/g,'')){
                                    this.setValue(value.replace(/[^a-zA-Z0-9_\-@.]/g,''));
                                }

                                return true;
                            }
                        },
                        {
                            xtype: "button",
                            text: t("search"),
                            iconCls: "opendxp_icon_search",
                            style: "margin-left: 20px;",
                            handler: this.search.bind(this)
                        }
                    ]
                }


            ]
        });

        return this.formPanel;

    },


    search: function() {
        var searchParams = this.formPanel.getForm().getFieldValues();

        Ext.Ajax.request({
            url: Routing.generate('opendxp_admin_gdpr_admin_getdataproviders'),
            success: function (response) {

                this.tabPanel.removeAll();

                var res = Ext.decode(response.responseText);

                for(var i = 0; i < res.length; i++) {

                    var definition = res[i];
                    var constructor = this.stringToFunction(definition.jsClass);

                    var panel = new constructor(searchParams);
                    this.tabPanel.add(panel.getPanel());
                }

                this.tabPanel.setActiveTab(0);
            }.bind(this)
        });
    },

    stringToFunction: function(str) {
        var arr = str.split(".");

        var fn = (window || this);
        for (var i = 0, len = arr.length; i < len; i++) {
            fn = fn[arr[i]];
        }

        if (typeof fn !== "function") {
            throw new Error("function not found");
        }

        return  fn;
    },

    getTabPanel: function() {

        this.tabPanel = Ext.create('Ext.tab.Panel', {
            region: 'center'
        });

        return this.tabPanel;
    }



});

