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

opendxp.registerNS('opendxp.object.selectoptions');

/**
 * @private
 */
opendxp.object.selectoptions = Class.create({
    initialize: function () {
        this.getTabPanel();
    },

    getTabPanel: function () {
        if (!this.panel) {
            this.panel = new Ext.Panel({
                id: 'opendxp_selectoptions',
                title: t('selectoptions'),
                iconCls: 'opendxp_icon_select',
                border: false,
                layout: 'border',
                closable:true,
                items: [this.getTree(), this.getEditPanel()]
            });

            var tabPanel = Ext.getCmp('opendxp_panel_tabs');
            tabPanel.add(this.panel);
            tabPanel.setActiveItem('opendxp_selectoptions');

            this.panel.on('destroy', function () {
                opendxp.globalmanager.remove('selectoptions');
            }.bind(this));

            opendxp.layout.refresh();
        }

        return this.panel;
    },

    getTree: function () {
        if (!this.tree) {
            this.store = Ext.create('Ext.data.TreeStore', {
                autoLoad: false,
                autoSync: true,
                proxy: {
                    type: 'ajax',
                    url: Routing.generate('opendxp_admin_dataobject_class_selectoptionstree'),
                    reader: {
                        type: 'json'

                    },
                    extraParams: {
                        grouped: 1
                    }
                }
            });

            this.tree = Ext.create('Ext.tree.Panel', {
                id: 'opendxp_panel_selectoptions_tree',
                store: this.store,
                region: 'west',
                autoScroll:true,
                animate:false,
                containerScroll: true,
                width: 200,
                split: true,
                root: {
                    id: '0'
                },
                listeners: this.getTreeNodeListeners(),
                rootVisible: false,
                tbar: {
                    cls: 'opendxp_toolbar_border_bottom',
                    items: [
                        {
                            text: t('add'),
                            iconCls: 'opendxp_icon_select opendxp_icon_overlay_add',
                            handler: this.addDefinition.bind(this),
                            disabled: !opendxp.settings['select-options-writeable']
                        }
                    ]
                }
            });

            this.tree.on('render', function () {
                this.getRootNode().expand();
            });
        }

        return this.tree;
    },

    getEditPanel: function () {
        if (!this.editPanel) {
            this.editPanel = Ext.create('Ext.tab.Panel', {
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
            'itemcontextmenu': this.onTreeNodeContextmenu.bind(this),
            'beforeitemmove': this.onTreeNodeBeforeMove.bind(this)
        };
        return treeNodeListeners;
    },

    onTreeNodeClick: function (tree, record) {
        if (!record.isLeaf()) {
            return;
        }
        this.openSelectOptions(record.data.id);
    },

    openSelectOptions: function (id) {
        if (Ext.getCmp('opendxp_selectoptions_editor_panel_' + id)) {
            this.getEditPanel().setActiveTab(Ext.getCmp('opendxp_selectoptions_editor_panel_' + id));
            return;
        }

        Ext.Ajax.request({
            url: Routing.generate('opendxp_admin_dataobject_class_selectoptionsget'),
            params: {
                id: id
            },
            success: this.addDefinitionPanel.bind(this)
        });
    },

    addDefinitionPanel: function (response) {
        var data = Ext.decode(response.responseText);
        new opendxp.object.selectoptionsitems.definition(
            data,
            this,
            this.openSelectOptions.bind(this, data.id),
            'opendxp_selectoptions_editor_panel_'
        );
        opendxp.layout.refresh();
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
            iconCls: 'opendxp_icon_select opendxp_icon_overlay_delete',
            handler: this.deleteDefinition.bind(this, tree, record)
        }));

        menu.showAt(e.pageX, e.pageY);
    },

    onTreeNodeBeforeMove: function (node, oldParent, newParent, index, eOpts ) {
        return opendxp.helpers.treeDragDropValidate(node, oldParent, newParent);
    },

    addDefinition: function () {
        Ext.MessageBox.prompt(' ', t('enter_the_name_of_the_new_item'),
            this.addDefinitionComplete.bind(this), null, null, '');
    },

    addDefinitionComplete: function (button, value, object) {
        var isValidName = /^[A-Z][a-zA-Z0-9]*$/;

        if (
            button !== 'ok'
            || value.length < 3
            || !isValidName.test(value)
            || opendxp.object.helpers.reservedWords.isReservedWord(value)
        ) {
            if (button !== 'cancel') {
                Ext.Msg.alert(' ', t('failed_to_create_new_item_select_options'));
            }
            return;
        }

        Ext.Ajax.request({
            url: Routing.generate('opendxp_admin_dataobject_class_selectoptionsupdate'),
            method: 'POST',
            params: {
                id: value,
                task: 'add'
            },
            success: function (response) {
                this.tree.getStore().load();

                var data = Ext.decode(response.responseText);
                if (!data) {
                    return;
                }

                if (data.success) {
                    this.openSelectOptions(data.id);
                    opendxp.object.helpers.selectField.getSelectOptionsStore().reload();
                } else {
                    opendxp.helpers.showNotification(t('error'), data.message, 'error', response.responseText);
                }
            }.bind(this)
        });
    },

    activate: function () {
        Ext.getCmp('opendxp_panel_tabs').setActiveItem('opendxp_selectoptions');
    },

    deleteDefinition: function (tree, record) {
        Ext.Msg.confirm(t('delete'), sprintf(t('delete_message_advanced'), t('selectoptions'), record.data.text), function (btn) {
            if (btn === 'yes') {
                Ext.Ajax.request({
                    url: Routing.generate('opendxp_admin_dataobject_class_selectoptionsdelete'),
                    method: 'DELETE',
                    params: {
                        id: record.data.id
                    },
                    success: function (response) {
                        var data = Ext.decode(response.responseText);
                        if (data && data.success === false) {
                            opendxp.helpers.showNotification(t('error'), data.message, 'error', response.responseText);
                            return;
                        }

                        this.getEditPanel().removeAll();
                        record.remove();
                    }.bind(this)
                });
            }
        }.bind(this));
    }
});