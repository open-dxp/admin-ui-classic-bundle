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


opendxp.registerNS("opendxp.settings.user.role.panel");
/**
 * @private
 */
opendxp.settings.user.role.panel = Class.create(opendxp.settings.user.panels.abstract, {

    getTabPanel: function () {

        if (!this.panel) {
            this.panel = new Ext.Panel({
                id: "opendxp_roles",
                title: t("roles"),
                iconCls: "opendxp_icon_roles",
                border: false,
                layout: "border",
                closable:true,
                items: [this.getRoleTree(), this.getEditPanel()]
            });

            var tabPanel = Ext.getCmp("opendxp_panel_tabs");
            tabPanel.add(this.panel);
            tabPanel.setActiveItem("opendxp_roles");

            this.panel.on("destroy", function () {
                opendxp.globalmanager.remove("roles");
            }.bind(this));

            this.panel.updateLayout();
            opendxp.layout.refresh();
        }

        return this.panel;
    },

    getRoleTree: function () {
        if (!this.tree) {
            var store = Ext.create('Ext.data.TreeStore', {
                proxy: {
                    type: 'ajax',
                    url: Routing.generate('opendxp_admin_user_roletreegetchildrenbyid')
                }
            });

            this.tree = Ext.create('Ext.tree.Panel', {
                id: "opendxp_panel_roles_tree",
                store: store,
                region: "west",
                autoScroll:true,
                animate:false,
                containerScroll: true,
                border: true,
                split:true,
                width: 180,
                root: {
                    draggable:false,
                    id: '0',
                    text: t("all_roles"),
                    allowChildren: true,
                    iconCls: "opendxp_icon_folder",
                    expanded: true
                },
                viewConfig: {
                    plugins: {
                        ptype: 'treeviewdragdrop',
                        appendOnly: true,
                        ddGroup: "roles"
                    },
                    listeners: {
                        drop: function(node, data, overModel) {
                            this.update(data.records[0].id, {parentId: overModel.id})
                        }.bind(this)
                    }
                }
                ,
                listeners: this.getTreeNodeListeners()
            });
        }
        this.tree.getRootNode().expand();

        return this.tree;
    },

    onTreeNodeClick: function (tree, record, item, index, e, eOpts ) {

        if(!record.data.allowChildren && record.data.id > 0) {
            var rolePanelKey = "role_" + record.data.id;
            if(this.panels[rolePanelKey]) {
                this.panels[rolePanelKey].activate();
            } else {
                var rolePanel = new opendxp.settings.user.role.tab(this, record.data.id);
                this.panels[rolePanelKey] = rolePanel;
            }
        }
    },

    onTreeNodeContextmenu: function (tree, record, item, index, e, eOpts ) {
        tree.select();

        var menu = new Ext.menu.Menu();

        if (record.data.allowChildren) {
            menu.add(new Ext.menu.Item({
                text: t('create_folder'),
                iconCls: "opendxp_icon_folder opendxp_icon_overlay_add",
                listeners: {
                    "click": this.add.bind(this, "rolefolder", null, record)
                }
            }));
            menu.add(new Ext.menu.Item({
                text: t('add_role'),
                iconCls: "opendxp_icon_roles opendxp_icon_overlay_add",
                listeners: {
                    "click": this.add.bind(this, "role", null, record)
                }
            }));
        } else if (record.data.elementType == "role") {
            menu.add(new Ext.menu.Item({
                text: t('clone'),
                iconCls: "opendxp_icon_roles opendxp_icon_overlay_add",
                listeners: {
                    "click": this.add.bind(this, "role", record, record)
                }
            }));
        }

        if (record.data.id > 0) {
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
                 opendxp.helpers.showNotification(t("error"), t("role_creation_error"), "error",t(data.message));
            }

        } catch(e){
            console.log(e);
            opendxp.helpers.showNotification(t("error"), t("role_creation_error"), "error");
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
        Ext.getCmp("opendxp_panel_tabs").setActiveItem("opendxp_roles");
    }
});





