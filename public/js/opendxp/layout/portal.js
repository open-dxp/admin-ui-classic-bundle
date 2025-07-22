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

opendxp.registerNS("opendxp.layout.portal");
/**
 * @private
 */
opendxp.layout.portal = Class.create({

    key: "welcome",

    initialize: function (key) {
        this.activePortlets = [];

        if(key) {
            this.key = key;
        }

        this.loadConfiguration();
    },

    loadConfiguration: function () {
        Ext.Ajax.request({
            url: Routing.generate('opendxp_admin_portal_getconfiguration'),
            params: {
                key: this.key
            },
            success: this.initConfiguration.bind(this)
        });
    },

    initConfiguration: function (response) {
        var config = [
            [],
            []
        ];
        var userConf = Ext.decode(response.responseText);
        var dynClass;
        var portletInstance;

        this.userConf = userConf;

        if (userConf.positions.length == 2) {

            for (var i = 0; i < 2; i++) {
                for (var c = 0; c < userConf.positions[i].length; c++) {
                    try {
                        var type = userConf.positions[i][c].type;
                        //if (
                        //    type != "opendxp.layout.portlets.modifiedAssets"
                        // && type != "opendxp.layout.portlets.modifiedDocuments"
                        //&& type != "opendxp.layout.portlets.modifiedObjects"
                        //) {
                        //    continue;
                        //}

                        dynClass = eval(type);
                        if (dynClass) {
                            if (!dynClass.prototype.isAvailable()) {
                                continue;
                            }

                            portletInstance = new dynClass();
                            portletInstance.setPortal(this);
                            portletInstance.setConfig(userConf.positions[i][c].config);
                            var portletLayout = portletInstance.getLayout(userConf.positions[i][c].id);

                            config[i].push(portletLayout);
                            this.activePortlets.push(userConf.positions[i][c].id);
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }

            this.getTabPanel(config);
        }

    },

    activate: function () {
        var tabPanel = Ext.getCmp("opendxp_panel_tabs");
        tabPanel.setActiveItem("opendxp_portal_" + this.key);
    },

    getTabPanel: function (config) {

        var portletMenu = [];
        var portlets = Object.keys(opendxp.layout.portlets);

        for (var i = 0; i < portlets.length; i++) {
            var portletType = portlets[i];

            if (opendxp.settings.disabledPortlets["opendxp.layout.portlets." + portletType]) {
                continue;
            }

            if (!opendxp.layout.portlets[portletType].prototype.isAvailable()) {
                continue;
            }

            if (portletType != "abstract") {
                portletMenu.push({
                    text: opendxp.layout.portlets[portletType].prototype.getName(),
                    iconCls: opendxp.layout.portlets[portletType].prototype.getIcon(),
                    handler: this.addPortlet.bind(this, opendxp.layout.portlets[portletType].prototype.getType())
                });
            }
        }

        if (!this.panel) {
            this.panel = Ext.create('Portal.view.PortalPanel', {
                id: "opendxp_portal_" + this.key,
                layout: 'column',
                title: t(this.key),
                border: true,
                bodyCls: 'x-portal-body',
                iconCls: "opendxp_icon_welcome",
                closable:true,
                autoScroll: true,
                tbar: [
                    "->",
                    {
                        type: 'button',
                        text: t("add_portlet"),
                        iconCls: "opendxp_icon_add",
                        menu: portletMenu
                    },
                    {
                        text: t("delete"),
                        iconCls: "opendxp_icon_delete",
                        hidden: (this.key == "welcome"),
                        handler: function() {
                            Ext.Msg.show({
                                msg: t('delete_message'),
                                buttons: Ext.Msg.YESNO,
                                fn: function(btn) {
                                    if(btn == "yes") {
                                        var tabPanel = Ext.getCmp("opendxp_panel_tabs");
                                        tabPanel.remove("opendxp_portal_" + this.key);

                                        Ext.Ajax.request({
                                            url: Routing.generate('opendxp_admin_portal_deletedashboard'),
                                            method: "DELETE",
                                            params: {
                                                key: this.key
                                            },
                                            success: function() {
                                                Ext.MessageBox.confirm(t("info"), t("reload_opendxp_changes"), function (buttonValue) {
                                                    if (buttonValue == "yes") {
                                                        window.location.reload();
                                                    }
                                                });
                                            }
                                        });

                                    }
                                }.bind(this),
                                icon: Ext.MessageBox.QUESTION
                            });
                        }.bind(this)
                    }
                ]
                ,
                items:[
                    {
                        id: "opendxp_portal_col0_" + this.key,
                        xtype: 'portalcolumn',
                        //columnWidth: 0.5,
                        style:'padding:10px',
                        items: config[0],
                        title: 'left'
                    },
                    {
                        id: "opendxp_portal_col1_" + this.key,
                        xtype: 'portalcolumn',
                        //columnWidth: 0.5,
                        style:'padding:10px 10px 10px 0',
                        items: config[1],
                        title: 'right'
                    }
                ]
            });


            this.panel.on('drop', function(e) {
                Ext.Ajax.request({
                    url: Routing.generate('opendxp_admin_portal_reorderwidget'),
                    method: 'PUT',
                    params: {
                        key: this.key,
                        id: e.panel.portletId,
                        column: e.columnIndex,
                        row: e.position
                    }
                });

            }.bind(this));

            this.panel.on("destroy", function () {
                opendxp.globalmanager.remove("layout_portal_" + this.key);
            }.bind(this));

            var tabPanel = Ext.getCmp("opendxp_panel_tabs");
            tabPanel.add(this.panel);
            tabPanel.setActiveItem("opendxp_portal_" + this.key);

            opendxp.layout.refresh();
        }

        return this.panel;
    },

    addPortlet: function (type) {

        var dynClass = eval(type);
        if (dynClass) {

            Ext.Ajax.request({
                url: Routing.generate('opendxp_admin_portal_addwidget'),
                method: 'POST',
                params: {
                    key: this.key,
                    type: type
                },
                success: function(response) {
                    var response = Ext.decode(response.responseText);
                    if(response.success) {
                        var portletInstance = new dynClass();
                        portletInstance.setPortal(this);

                        var col = Ext.getCmp("opendxp_portal_col0_" + this.key);
                        col.add(portletInstance.getLayout(response.id));
                        this.panel.updateLayout();
                    }
                }.bind(this)
            });

            this.activePortlets.push(type);

        }
    }

});

