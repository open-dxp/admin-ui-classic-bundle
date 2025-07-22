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

opendxp.registerNS("opendxp.settings.thumbnail.panel");
/**
 * @private
 */
opendxp.settings.thumbnail.panel = Class.create({

    initialize: function () {

        this.getTabPanel();
    },

    activate: function () {
        var tabPanel = Ext.getCmp("opendxp_panel_tabs");
        tabPanel.setActiveItem("opendxp_thumbnails");
    },

    getTabPanel: function () {

        if (!this.panel) {
            this.panel = new Ext.Panel({
                id: "opendxp_thumbnails",
                title: t("image_thumbnails"),
                iconCls: "opendxp_icon_thumbnails",
                border: false,
                layout: "border",
                closable: true,
                items: [this.getTree(), this.getEditPanel()]
            });

            var tabPanel = Ext.getCmp("opendxp_panel_tabs");
            tabPanel.add(this.panel);
            tabPanel.setActiveItem("opendxp_thumbnails");

            this.panel.on("destroy", function () {
                opendxp.globalmanager.remove("thumbnails");
            }.bind(this));

            opendxp.layout.refresh();
        }

        return this.panel;
    },

    getTree: function () {
        if (!this.tree) {
            var store = Ext.create('Ext.data.TreeStore', {
                autoLoad: false,
                autoSync: true,
                proxy: {
                    type: 'ajax',
                    url: Routing.generate('opendxp_admin_settings_thumbnailtree'),
                    reader: {
                        type: 'json'
                    }
                },
                root: {
                    iconCls: "opendxp_icon_thumbnails"
                },
                sorters: ['text']
            });


            this.tree = Ext.create('Ext.tree.Panel', {
                store: store,
                id: "opendxp_panel_thumbnail_tree",
                region: "west",
                autoScroll: true,
                animate: false,
                containerScroll: true,
                width: 200,
                split: true,
                root: {
                    id: '0',
                    expanded: true,
                    iconCls: "opendxp_icon_thumbnails"

                },
                listeners: this.getTreeNodeListeners(),
                rootVisible: false,
                tbar: {
                    cls: 'opendxp_toolbar_border_bottom',
                    items: [
                        {
                            text: t("add"),
                            iconCls: "opendxp_icon_add",
                            handler: this.addField.bind(this),
                            disabled: !opendxp.settings['image-thumbnails-writeable']
                        }
                    ]
                }
            });

            this.tree.on("render", function () {
                this.getRootNode().expand();
            });
        }

        return this.tree;
    },

    getEditPanel: function () {
        if (!this.editPanel) {
            this.editPanel = new Ext.TabPanel({
                region: "center",
                plugins:
                    [
                        Ext.create('Ext.ux.TabCloseMenu', {
                            showCloseAll: true,
                            showCloseOthers: true
                        }),
                        Ext.create('Ext.ux.TabReorderer', {})
                    ]
            });
        }

        return this.editPanel;
    },

    getTreeNodeListeners: function () {
        var treeNodeListeners = {
            'itemclick': this.onTreeNodeClick.bind(this),
            'itemcontextmenu': this.onTreeNodeContextmenu.bind(this)
        };

        return treeNodeListeners;
    },

    onTreeNodeClick: function (tree, record, item, index, e, eOpts) {
        if (!record.isLeaf()) {
            return;
        }

        this.openThumbnail(record.data.id);
    },

    openThumbnail: function (id) {

        var existingPanel = Ext.getCmp("opendxp_thumbnail_panel_" + id);
        if (existingPanel) {
            this.editPanel.setActiveItem(existingPanel);
            return;
        }

        Ext.Ajax.request({
            url: Routing.generate('opendxp_admin_settings_thumbnailget'),
            params: {
                name: id
            },
            success: function (response) {
                var data = Ext.decode(response.responseText);

                var fieldPanel = new opendxp.settings.thumbnail.item(data, this);
                opendxp.layout.refresh();
            }.bind(this)
        });
    },

    onTreeNodeContextmenu: function (tree, record, item, index, e, eOpts) {
        if (!record.isLeaf()) {
            return;
        }

        e.stopEvent();

        tree.select();

        var menu = new Ext.menu.Menu();
        menu.add(new Ext.menu.Item({
            text: t('delete'),
            iconCls: "opendxp_icon_delete",
            handler: this.deleteField.bind(this, tree, record),
            disabled: !record.data.writeable
        }));


        menu.showAt(e.pageX, e.pageY);
    },

    addField: function () {
        Ext.MessageBox.prompt(' ', t('enter_the_name_of_the_new_item'),
            this.addFieldComplete.bind(this), null, null, "");
    },

    addFieldComplete: function (button, value, object) {

        var regresult = value.match(/[a-zA-Z0-9_\-]+/);

        if (button == "ok" && value.length > 2 && regresult == value) {

            var thumbnails = this.tree.getRootNode().childNodes;
            for (var i = 0; i < thumbnails.length; i++) {
                if (thumbnails[i].text == value) {
                    Ext.MessageBox.alert(' ', t('name_already_in_use'));
                    return;
                }
            }

            Ext.Ajax.request({
                url: Routing.generate('opendxp_admin_settings_thumbnailadd'),
                method: "POST",
                params: {
                    name: value
                },
                success: function (response) {
                    var data = Ext.decode(response.responseText);

                    this.tree.getStore().load();

                    if (!data || !data.success) {
                        Ext.Msg.alert(' ', t('failed_to_create_new_item'));
                    } else {
                        this.openThumbnail(data.id);
                    }
                }.bind(this)
            });
        }
        else if (button == "cancel") {
            return;
        }
        else {
            Ext.Msg.alert(' ', t('failed_to_create_new_item'));
        }
    },

    deleteField: function (tree, record) {
        opendxp.helpers.deleteConfirm(t('thumbnail'), record.data.text, function () {
            Ext.Ajax.request({
                url: Routing.generate('opendxp_admin_settings_thumbnaildelete'),
                method: 'DELETE',
                params: {
                    name: record.data.id
                }
            });

            this.getEditPanel().removeAll();
            record.remove();
        }.bind(this));
    }
});

