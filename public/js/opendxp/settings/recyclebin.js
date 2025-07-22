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

opendxp.registerNS("opendxp.settings.recyclebin");
/**
 * @private
 */
opendxp.settings.recyclebin = Class.create({

    initialize: function () {
        this.getTabPanel();
    },

    activate: function () {
        var tabPanel = Ext.getCmp("opendxp_panel_tabs");
        tabPanel.setActiveItem("opendxp_recyclebin");
    },

    getTabPanel: function () {

        if (!this.panel) {
            this.panel = new Ext.Panel({
                id: "opendxp_recyclebin",
                title: t("recyclebin"),
                border: false,
                iconCls: "opendxp_icon_recyclebin",
                layout: "fit",
                closable: true,
                items: [this.getGrid()]
            });

            var tabPanel = Ext.getCmp("opendxp_panel_tabs");
            tabPanel.add(this.panel);
            tabPanel.setActiveItem("opendxp_recyclebin");


            this.panel.on("destroy", function () {
                opendxp.globalmanager.remove("recyclebin");
            }.bind(this));

            opendxp.layout.refresh();
        }

        return this.panel;
    },

    getGrid: function () {

        var itemsPerPage = opendxp.helpers.grid.getDefaultPageSize();
        this.store = opendxp.helpers.grid.buildDefaultStore(
            Routing.generate('opendxp_admin_recyclebin_list'),
            [
                {name: 'id'},
                {name: 'type'},
                {name: 'subtype'},
                {name: 'path'},
                {name: 'amount'},
                {name: 'deletedby'},
                {name: 'date'}
            ],
            itemsPerPage
        );
        this.store.getProxy().setBatchActions(false);

        this.store.addListener('load', function () {
            if (this.store.getCount() > 0) {
                Ext.getCmp("opendxp_recyclebin_button_flush").enable();
            }
        }.bind(this));


        this.filterField = new Ext.form.TextField({
            xtype: "textfield",
            width: 200,
            style: "margin: 0 10px 0 0;",
            enableKeyEvents: true,
            listeners: {
                "keydown": function (field, key) {
                    if (key.getKey() == key.ENTER) {
                        var input = field;
                        var proxy = this.store.getProxy();
                        proxy.extraParams.filterFullText = input.getValue();
                        this.store.load();
                    }
                }.bind(this)
            }
        });

        this.pagingtoolbar = opendxp.helpers.grid.buildDefaultPagingToolbar(this.store);

        var typesColumns = [
            {
                text: t("type"), width: 50, sortable: true, dataIndex: 'subtype', renderer: function (d) {
                    return '<img src="/bundles/opendxpadmin/img/flat-color-icons/' + d + '.svg" style="height: 16px" />';
                }
            },
            {text: t("path"), flex: 200, sortable: true, dataIndex: 'path', filter: 'string', renderer: Ext.util.Format.htmlEncode},
            {text: t("amount"), flex: 60, sortable: true, dataIndex: 'amount'},
            {text: t("deletedby"), flex: 80, sortable: true, dataIndex: 'deletedby', filter: 'string'},
            {
                text: t("date"), flex: 140, sortable: true, dataIndex: 'date',
                renderer: function (d) {
                    var date = new Date(d * 1000);
                    return Ext.Date.format(date, opendxp.globalmanager.get('localeDateTime').getDateTimeFormat());
                },
                filter: 'date'

            },
            {
                xtype: 'actioncolumn',
                menuText: t('delete'),
                width: 30,
                items: [{
                    tooltip: t('delete'),
                    icon: "/bundles/opendxpadmin/img/flat-color-icons/delete.svg",
                    handler: function (grid, rowIndex) {
                        grid.getStore().removeAt(rowIndex);
                    }.bind(this)
                }]
            }
        ];

        var toolbar = Ext.create('Ext.Toolbar', {
            cls: 'opendxp_main_toolbar',
            items: [
                {
                    text: t('restore'),
                    handler: this.restoreSelected.bind(this),
                    iconCls: "opendxp_icon_restore",
                    id: "opendxp_recyclebin_button_restore",
                    disabled: true
                }, '-', {
                    text: t('delete'),
                    handler: this.deleteSelected.bind(this),
                    iconCls: "opendxp_icon_delete",
                    id: "opendxp_recyclebin_button_delete",
                    disabled: true
                }, "-",
                {
                    text: t('flush_recyclebin'),
                    handler: this.onFlush.bind(this),
                    iconCls: "opendxp_icon_flush_recyclebin",
                    id: "opendxp_recyclebin_button_flush",
                    disabled: true
                },
                '->', {
                    text: t("filter") + "/" + t("search"),
                    xtype: "tbtext",
                    style: "margin: 0 10px 0 0;"
                },
                this.filterField
            ]
        });

        this.selectionColumn = new Ext.selection.CheckboxModel();
        this.selectionColumn.on("selectionchange", this.updateButtonStates.bind(this));

        this.grid = new Ext.grid.GridPanel({
            frame: false,
            autoScroll: true,
            store: this.store,
            columnLines: true,
            bbar: this.pagingtoolbar,
            stripeRows: true,
            selModel: this.selectionColumn,
            plugins: ['opendxp.gridfilters'],
            columns: typesColumns,
            tbar: toolbar,
            listeners: {
                "rowclick": this.updateButtonStates.bind(this)
            },
            viewConfig: {
                forceFit: true
            }
        });

        this.grid.on("rowcontextmenu", this.onRowContextmenu.bind(this));

        return this.grid;
    },

    updateButtonStates: function() {
        var selectedRows = this.grid.getSelectionModel().getSelection();

        if (selectedRows.length >= 1) {
            Ext.getCmp("opendxp_recyclebin_button_restore").enable();
            Ext.getCmp("opendxp_recyclebin_button_delete").enable();
        } else {
            Ext.getCmp("opendxp_recyclebin_button_restore").disable();
            Ext.getCmp("opendxp_recyclebin_button_delete").disable();
        }
    },

    onRowContextmenu: function (grid, record, tr, rowIndex, e, eOpts) {

        var menu = new Ext.menu.Menu();
        var selModel = grid.getSelectionModel();
        var selectedRows = selModel.getSelection();

        menu.add(new Ext.menu.Item({
            text: t('restore'),
            iconCls: "opendxp_icon_restore",
            handler: this.restoreSelected.bind(this),
            disabled: !selectedRows.length
        }));
        menu.add(new Ext.menu.Item({
            text: t('delete'),
            iconCls: "opendxp_icon_delete",
            handler: this.deleteSelected.bind(this),
            disabled: !selectedRows.length
        }));


        e.stopEvent();
        menu.showAt(e.getXY());
    },

    deleteSelected: function () {
        var selectedRows = this.grid.getSelectionModel().getSelection();
        this.grid.getStore().remove(selectedRows);
    },

    onFlush: function (btn, ev) {
        Ext.Ajax.request({
            url: Routing.generate('opendxp_admin_recyclebin_flush'),
            method: 'DELETE',
            success: function () {
                this.store.reload();
                this.grid.getView().refresh();
            }.bind(this)
        });
    },

    doRestore: function (ids, offset) {

        this.store.reload();
        this.grid.getView().refresh();

        if (offset == ids.length) {
            try {
                // would be nice if /admin/recyclebin/restore could return the affected types
                // so that we don't have to refresh all types
               const elementTypes = ["document", "asset", "object"];
               elementTypes.forEach(function(elementType, index) {
                   opendxp.elementservice.refreshRootNodeAllTrees(elementType);
                });
            }
            catch (e) {
                console.log(e);
            }
            opendxp.helpers.loadingHide();
            return;

        }

        Ext.Ajax.request({
            url: Routing.generate('opendxp_admin_recyclebin_restore'),
            method: 'POST',
            params: {
                id: ids[offset]
            },
            success: function (ids, offset) {
                this.doRestore(ids, offset + 1);

            }.bind(this, ids, offset),

            failure: function (response) {
                opendxp.helpers.loadingHide();
                var message = t('restore_failed');

                try {
                    var json = Ext.decode(response.responseText);
                    if (json.message) {
                        message += ': ' + json.message;
                    }
                } catch (e) {
                }

                opendxp.helpers.showNotification(t("error"), message, "error");
            }.bind(this)
        });

    },

    restoreSelected: function () {

        var selectedRows = this.grid.getSelectionModel().getSelection();
        if (selectedRows.length <= 0) {
            return;
        }

        var ids = [];
        for (var i = 0; i < selectedRows.length; i++) {
            ids.push(selectedRows[i].data.id);
        }

        opendxp.helpers.loadingShow();
        Ext.getCmp("opendxp_recyclebin_button_restore").disable();
        Ext.getCmp("opendxp_recyclebin_button_delete").disable();

        this.doRestore(ids, 0);
    }
});
