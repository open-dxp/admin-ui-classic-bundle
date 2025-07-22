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

opendxp.registerNS("opendxp.object.classificationstore.storeTree");
/**
 * @private
 */
opendxp.object.classificationstore.storeTree = Class.create({

    activeStoreId: 0,

    initialize: function () {
        this.getTabPanel();
    },

    getTabPanel: function () {

        if (!this.panel) {
            this.panel = new Ext.Panel({
                iconCls: "opendxp_icon_classificationstore",
                id: "opendxp_object_classificationstore_configpanel",
                title: t("classification_store"),
                border: false,
                layout: "border",
                closable:true,
                items: [this.getStoreTree(), this.getEditContainer()],
                tbar: {
                    cls: 'opendxp_toolbar_border_bottom',
                    items: [
                        {
                            text: t('add'),
                            handler: this.onAdd.bind(this),
                            iconCls: "opendxp_icon_add"
                        }
                    ]
                }
            });

            var tabPanel = Ext.getCmp("opendxp_panel_tabs");
            tabPanel.add(this.panel);
            tabPanel.setActiveItem("opendxp_object_classificationstore_configpanel");

            this.panel.on("destroy", function () {
                opendxp.globalmanager.remove("classificationstore_config");
            }.bind(this));

            this.panel.updateLayout();
            opendxp.layout.refresh();
        }

        return this.panel;
    },

    getEditContainer: function() {
        this.editContainer = new Ext.TabPanel({
            region: 'center',
            layout: 'fit',
            cls: "opendxp-panel-header-no-border",
        });


        return this.editContainer;
    },

    getTreeNodeListeners: function () {
        var treeNodeListeners = {
            'itemclick' : this.onTreeNodeClick.bind(this),
            'itemcontextmenu': this.onTreeNodeContextmenu.bind(this)
        };

        return treeNodeListeners;
    },

    getStoreTree: function () {
        if (!this.tree) {
            this.treeStore = Ext.create('Ext.data.TreeStore', {
                proxy: {
                    type: 'ajax',
                    url: Routing.generate('opendxp_admin_dataobject_classificationstore_storetree'),
                    reader: {
                        type: 'json'
                    }
                }
            });

            this.tree = Ext.create('Ext.tree.Panel', {
                store: this.treeStore,
                region: "west",
                autoScroll:true,
                animate:false,
                containerScroll: true,
                split:true,
                width: 180,
                rootVisible: false,
                viewConfig: {
                    listeners: {
                        drop: function(node, data, overModel) {
                            this.update(data.records[0].id, {parentId: overModel.id})
                        }.bind(this)
                    }
                },
                listeners: this.getTreeNodeListeners()
            });
        }
        this.tree.getRootNode().expand();

        return this.tree;
    },


    openStore: function(storeConfig) {
        try {
            if (storeConfig.id != this.activeStoreId) {
                this.editContainer.removeAll();

                this.editContainer.setTitle(storeConfig.text + " (ID: " + storeConfig.id + ")");
                var propertiesPanel = new opendxp.object.classificationstore.propertiespanel(storeConfig, this.editContainer);
                var groupsPanel = new opendxp.object.classificationstore.groupsPanel(storeConfig, this.editContainer, propertiesPanel);
                var collectionsPanel = new opendxp.object.classificationstore.collectionsPanel(storeConfig, groupsPanel).getPanel();


                this.editContainer.add(collectionsPanel);
                this.editContainer.add(groupsPanel.getPanel());
                this.editContainer.add(propertiesPanel.getPanel());

                this.editContainer.setActiveTab(collectionsPanel);

                this.editContainer.updateLayout();
                this.activeStoreId = storeConfig.id;
            }
        } catch (e) {
            console.log(e);
        }
    },

    onTreeNodeClick: function (tree, record, item, index, e, eOpts ) {
        if(!record.data.allowChildren && record.data.id > 0) {
            this.openStore(record.data);
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

        menu.add(new Ext.menu.Item({
            text: t('edit_configuration'),
            iconCls: "opendxp_icon_custom_views",
            listeners: {
                "click": function() {
                    var data = {
                        id: record.data.id,
                        name: Ext.util.Format.htmlDecode(record.data.text),
                        description: Ext.util.Format.htmlDecode(record.data.description)
                    }
                    var panel = new opendxp.object.classificationstore.storeConfiguration(data, this.applyConfig.bind(this));
                    panel.show();
                }.bind(this)
            }
        }));

        menu.showAt(e.pageX, e.pageY);
        e.stopEvent();

    },

    applyConfig: function(storeId, newData) {
        Ext.Ajax.request({
                url: Routing.generate('opendxp_admin_dataobject_classificationstore_editstore'),
                method: 'PUT',
                params: {
                    id: storeId,
                    data: Ext.encode(newData)
                },
                success: function (response) {
                    this.treeStore.reload();
                }.bind(this)
            }
        );
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
        Ext.getCmp("opendxp_panel_tabs").setActiveItem("opendxp_object_classificationstore_configpanel");
    },

    onAdd: function () {
        Ext.MessageBox.prompt(t('classificationstore_mbx_enterstore_title'), t('classificationstore_mbx_enterstore_prompt'),
            this.addFieldComplete.bind(this), null, null, "");
    },

    addFieldComplete: function (button, value, object) {

        value = value.trim();
        if (button == "ok" && value.length > 1) {
            Ext.Ajax.request({
                url: Routing.generate('opendxp_admin_dataobject_classificationstore_createstore'),
                method: 'POST',
                params: {
                    name: value
                },
                success: function (response) {
                    var data = Ext.decode(response.responseText);

                    if (!data || !data.success) {
                        Ext.Msg.alert(t("error"), t("classificationstore_error_addstore_msg"));
                    } else {
                        var storeId = data.storeId;

                        this.treeStore.reload({
                                callback: function () {
                                    var record = this.treeStore.getById(storeId);
                                    this.tree.getSelectionModel().select(record);
                                    this.openStore(record.data);
                                }.bind(this)
                            }
                        );
                    }
                }.bind(this)
            });
        }
        else if (button == "cancel") {
            return;
        }
        else {
            Ext.Msg.alert(t("classificationstore_configuration"), t("classificationstore_invalidname"));
        }
    }



});





