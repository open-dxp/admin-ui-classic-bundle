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

opendxp.registerNS("opendxp.notification.panel");

/**
 * @private
 */
opendxp.notification.panel = Class.create({

    initialize: function () {
        this.getTabPanel();
    },

    activate: function () {
        var tabPanel = Ext.getCmp("opendxp_panel_tabs");
        tabPanel.setActiveItem("opendxp_notification_panel");
    },

    getTabPanel: function () {
        if (!this.panel) {
            var gridPanel = new Ext.Panel({
                id: 'gridPanel',
                region: 'center',
                layout: "fit",
                items: [
                    this.getGrid()
                ]
            });

            this.panel = new Ext.Panel({
                id: "opendxp_notification_panel",
                title: t("notifications"),
                iconCls: "opendxp_icon_comments",
                border: false,
                layout: 'border',
                closable: true,
                items: [
                    gridPanel
                ],
            });

            var tabPanel = Ext.getCmp("opendxp_panel_tabs");
            tabPanel.add(this.panel);
            tabPanel.setActiveItem("opendxp_notification_panel");


            this.panel.on("destroy", function () {
                opendxp.globalmanager.remove("notifications");
            }.bind(this));

            opendxp.layout.refresh();
        }

        return this.panel;
    },

    getGrid: function () {
        var itemsPerPage = opendxp.helpers.grid.getDefaultPageSize();
        this.store = opendxp.helpers.grid.buildDefaultStore(
            Routing.generate('opendxp_admin_notification_findall'),
            ["id", "title", "sender", "timestamp", "read"],
            itemsPerPage
        );

        var typesColumns = [
            {header: "ID", flex: 1, sortable: false, hidden: true, dataIndex: 'id'},
            {
                header: t("title"),
                flex: 10,
                sortable: true,
                filter: 'string',
                dataIndex: 'title',
                renderer: function (val, metaData, record, rowIndex, colIndex, store) {
                    var read = parseInt(store.getAt(rowIndex).get("read"));
                    val = Ext.util.Format.htmlEncode(val);
                    if (read == 0) {
                        return '<strong style="font-weight: bold;">' + val + '</strong>'; // css style need to be added
                    }
                    return val;
                }
            },
            {header: t("sender"), flex: 2, sortable: false, dataIndex: 'sender', renderer: Ext.util.Format.htmlEncode},
            {
                header: t("date"), flex: 3, sortable: true, filter: 'date', dataIndex: 'timestamp',
                renderer: function(d) {
                    return Ext.Date.format(new Date(d*1000), opendxp.globalmanager.get('localeDateTime').getDateTimeFormat());
                }
            },
            {
                header: t("attachment"),
                xtype: 'actioncolumn',
                flex: 1,
                items: [
                    {
                        tooltip: t('open_linked_element'),
                        icon: "/bundles/opendxpadmin/img/flat-color-icons/cursor.svg",
                        handler: function (grid, rowIndex) {
                            opendxp.notification.helper.openLinkedElement(grid.getStore().getAt(rowIndex).data);
                        }.bind(this),
                        isDisabled: function (grid, rowIndex) {
                            return !parseInt(grid.getStore().getAt(rowIndex).data['linkedElementId']);
                        }.bind(this)
                    }
                ]
            },
            {
                xtype: 'actioncolumn',
                flex: 1,
                items: [
                    {
                        tooltip: t('open'),
                        icon: "/bundles/opendxpadmin/img/flat-color-icons/right.svg",
                        handler: function (grid, rowIndex) {
                            opendxp.notification.helper.openDetails(grid.getStore().getAt(rowIndex).get("id"), function () {
                                this.reload();
                            }.bind(this));
                        }.bind(this)
                    },
                    {
                        tooltip: t('mark_as_read'),
                        icon: '/bundles/opendxpadmin/img/flat-color-icons/checkmark.svg',
                        handler: function (grid, rowIndex) {
                            opendxp.notification.helper.markAsRead(grid.getStore().getAt(rowIndex).get("id"), function () {
                                this.reload();
                            }.bind(this));
                        }.bind(this),
                        isDisabled: function (grid, rowIndex) {
                            return parseInt(grid.getStore().getAt(rowIndex).get("read"));
                        }.bind(this)
                    },
                    {
                        tooltip: t('delete'),
                        icon: '/bundles/opendxpadmin/img/flat-color-icons/delete.svg',
                        handler: function (grid, rowIndex) {
                            opendxp.notification.helper.delete(grid.getStore().getAt(rowIndex).get("id"), function () {
                                this.reload();
                            }.bind(this));
                        }.bind(this)
                    }

                ]
            }
        ];

        this.pagingtoolbar = opendxp.helpers.grid.buildDefaultPagingToolbar(this.store);

        var toolbar = Ext.create('Ext.Toolbar', {
            cls: 'opendxp_main_toolbar',
            items: [
                {
                    text: t("delete_all"),
                    iconCls: "opendxp_icon_delete",
                    handler: function () {
                        Ext.MessageBox.confirm(t("are_you_sure"), t("all_content_will_be_lost"),
                            function (buttonValue) {
                                if (buttonValue == "yes") {
                                    opendxp.notification.helper.deleteAll(function () {
                                        this.reload();
                                    }.bind(this));
                                }
                            }.bind(this));
                    }.bind(this)
                }
            ]
        });

        this.grid = new Ext.grid.GridPanel({
            frame: false,
            autoScroll: true,
            store: this.store,
            plugins: ['opendxp.gridfilters'],
            columns: typesColumns,
            trackMouseOver: true,
            bbar: this.pagingtoolbar,
            columnLines: true,
            stripeRows: true,
            listeners: {
                "itemdblclick": function (grid, record, tr, rowIndex, e, eOpts) {
                    opendxp.notification.helper.openDetails(record.data.id, function () {
                        this.reload();
                    }.bind(this));
                }.bind(this)

            },
            viewConfig: {
                forceFit: true
            },
            tbar: toolbar
        });

        return this.grid;
    },

    reload: function () {
        this.store.reload();
    }
});
