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


opendxp.registerNS("opendxp.settings.user.panel");
/**
 * @private
 */
opendxp.settings.user.panel = Class.create(opendxp.settings.user.panels.abstract, {

    getTabPanel: function () {

        if (!this.panel) {
            this.panel = new Ext.Panel({
                id: "opendxp_users",
                title: t("users"),
                iconCls: "opendxp_icon_user",
                border: false,
                layout: "border",
                closable:true,
                items: [this.getUserTree(), this.getEditPanel()]
            });

            var tabPanel = Ext.getCmp("opendxp_panel_tabs");
            tabPanel.add(this.panel);
            tabPanel.setActiveItem("opendxp_users");

            this.panel.on("destroy", function () {
                opendxp.globalmanager.remove("users");
            }.bind(this));

            this.panel.updateLayout();
            opendxp.layout.refresh();
        }

        return this.panel;
    },

    getUserTree: function () {
        if (!this.tree) {
            var store = Ext.create('Ext.data.TreeStore', {
                proxy: {
                    type: 'ajax',
                    url: Routing.generate('opendxp_admin_user_treegetchildrenbyid')
                }
            });

            this.tree = Ext.create('Ext.tree.Panel', {
                id: "opendxp_panel_users_tree",
                store: store,
                region: "west",
                autoScroll:true,
                animate:false,
                containerScroll: true,
                split:true,
                width: 180,
                root: {
                    draggable:false,
                    id: '0',
                    text: t("all_users"),
                    allowChildren: true,
                    iconCls: "opendxp_icon_folder",
                    expanded: true
                },
                viewConfig: {
                    plugins: {
                        ptype: 'treeviewdragdrop',
                        appendOnly: true,
                        ddGroup: "users"
                    },
                    listeners: {
                        drop: function(node, data, overModel) {
                            this.update(data.records[0].id, {parentId: overModel.id})
                        }.bind(this)
                    }
                },
                tbar: {
                    cls: 'opendxp_toolbar_border_bottom',
                    items: ["->", {
                        text: t("search"),
                        iconCls: "opendxp_icon_search",
                        handler: this.openSearchPanel.bind(this)
                    }]
                },
                listeners: this.getTreeNodeListeners()
            });
        }
        this.tree.getRootNode().expand();

        return this.tree;
    },

    openSearchPanel: function () {
        var store = new Ext.data.Store({
            proxy: {
                type: 'ajax',
                url: Routing.generate('opendxp_admin_user_search'),
                reader: {
                    type: 'json',
                    rootProperty: 'users'
                }
            },
            fields: ["id", 'name', "email", "firstname", "lastname"]
        });

        var resultTpl = new Ext.XTemplate(
            '<tpl for="."><div class="x-boundlist-item" style="font-size: 11px;line-height: 15px;padding: 3px 10px 3px 10px; border: 1px solid #fff; border-bottom: 1px solid #eeeeee; color: #555;">',
            '<img style="float:left; padding-right: 10px; max-height:30px;" src="'+Routing.generate('opendxp_admin_user_getimage')+'?id={id}" />',
            '<h3 style="font-size: 13px;line-height: 16px;margin: 0;">{name} - {firstname} {lastname}</h3>',
            '{email} <b>ID: </b> {id}',
            '</div></tpl>'
        );

        var win = new Ext.Window({
            title: t("search"),
            iconCls: "opendxp_icon_search",
            width: 320,
            height: 150,
            modal: true,
            bodyStyle:"padding:10px",
            defaultFocus: 'name',
            items: [Ext.create('Ext.form.ComboBox' , {
                xtype: "combo",
                store: store,
                displayField:'name',
                itemId: 'name',
                valueField: "id",
                typeAhead: false,
                loadingText: t('searching'),
                width: 285,
                minChars: 1,
                queryDelay: 100,
                hideTrigger:true,
                tpl: resultTpl,
                triggerAction: "all",
                listeners: {
                    select: function(combo, record, index){
                        try {
                            this.openUser(record.get("id"));
                            win.close();
                        } catch (e) {
                            console.log(e)
                        }
                    }.bind(this)
                }
            })],
            buttons: [{
                text: t("close"),
                iconCls: "opendxp_icon_delete",
                handler: function () {
                    win.close();
                }
            }]
        });

        win.show();
    },

    openUser: function(userId) {
        try {
            var userPanelKey = "user_" + userId;
            if (this.panels[userPanelKey]) {
                this.panels[userPanelKey].activate();
            } else {
                var userPanel = new opendxp.settings.user.usertab(this, userId);
                this.panels[userPanelKey] = userPanel;
            }
        } catch (e) {
            console.log(e);
        }

    },

    onTreeNodeClick: function (tree, record, item, index, e, eOpts ) {

        var user = opendxp.globalmanager.get("user");
        if(record.data.admin && !user.admin) {
            Ext.MessageBox.alert(t("error"), t("you_are_not_allowed_to_manage_admin_users"));
            return;
        }

        if(!record.data.allowChildren && record.data.id > 0) {
            this.openUser(record.data.id);
        }
    },

    onTreeNodeContextmenu: function (tree, record, item, index, e, eOpts ) {
        tree.select();

        var user = opendxp.globalmanager.get("user");

        if(record.data.admin && !user.admin) {
            // only admin users are allowed to manage admin users
            return;
        }

        var menu = new Ext.menu.Menu();

        if (record.data.allowChildren) {
            menu.add(new Ext.menu.Item({
                text: t('create_folder'),
                iconCls: "opendxp_icon_folder opendxp_icon_overlay_add",
                listeners: {
                    "click": this.add.bind(this, "userfolder", null, record)
                }
            }));
            menu.add(new Ext.menu.Item({
                text: t('add_user'),
                iconCls: "opendxp_icon_user opendxp_icon_overlay_add",
                listeners: {
                    "click": this.add.bind(this, "user", null, record)
                }
            }));
        } else if (record.data.elementType == "user") {
            menu.add(new Ext.menu.Item({
                text: t('clone'),
                iconCls: "opendxp_icon_user opendxp_icon_overlay_add",
                listeners: {
                    "click": this.add.bind(this, "user", record, record)
                }
            }));
        }

        if (record.data.id > 0 && record.data.id != user.id && (record.data.type != "userfolder" || user.admin)) {
            menu.add(new Ext.menu.Item({
                text: t('delete'),
                iconCls: "opendxp_icon_delete",
                listeners: {
                    "click": this.remove.bind(this, tree, record)
                }
            }));
        }

        if(typeof menu.items != "undefined" && typeof menu.items.items != "undefined"
            && menu.items.items.length > 0) {
            menu.showAt(e.pageX, e.pageY);
        }
        e.stopEvent();

    },

    addComplete: function (parentNode, transport) {
        try{
            var data = Ext.decode(transport.responseText);
            if(data && data.success){
                var tree = parentNode.getOwnerTree();
                tree.getStore().reload({
                    node: parentNode
                });
            } else {
                opendxp.helpers.showNotification(t("error"), t("user_creation_error"), "error",t(data.message));
            }

        } catch(e){
            console.log(e);
            opendxp.helpers.showNotification(t("error"), t("user_creation_error"), "error");
        }
    },

    update: function (userId, values) {

        Ext.Ajax.request({
            url: Routing.generate('opendxp_admin_user_update'),
            method: "PUT",
            params: {
                id: userId,
                data: Ext.encode(values)
            },
            success: function (transport) {
                try{
                    var res = Ext.decode(transport.responseText);
                    if (res.success) {
                        opendxp.helpers.showNotification(t("success"), t("saved_successfully"), "success");
                    } else {
                        opendxp.helpers.showNotification(t("error"), t("saving_failed"), "error",t(res.message));
                    }
                } catch(e){
                    opendxp.helpers.showNotification(t("error"), t("saving_failed"), "error");
                }
            }.bind(this)
        });
    },

    activate: function () {
        Ext.getCmp("opendxp_panel_tabs").setActiveItem("opendxp_users");
    }
});





