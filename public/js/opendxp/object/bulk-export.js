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

opendxp.registerNS("opendxp.object.bulkexport");
/**
 * @private
 */
opendxp.object.bulkexport = Class.create(opendxp.object.bulkbase, {

    initialize: function () {

    },


    export: function() {

        Ext.Ajax.request({
            url: Routing.generate('opendxp_admin_dataobject_class_bulkexport'),
            method: "GET",
            success: function(transport){
                var data = Ext.decode(transport.responseText);

                if (data.success) {
                    //TODO show dialog
                    this.data = data.data;
                    this.getLayout();
                } else {
                    Ext.MessageBox.alert(t("error"), t("error"));
                }

            }.bind(this)
        });


    },


    getLayout: function () {

        if (this.window == null) {
            var store = new Ext.data.Store({
                autoDestroy: true,
                data: this.data,
                // sortInfo:{field: 'name', direction: "ASC"},
                fields: ["icon", "checked", "type", "name", "displayName"],
                groupField: 'type'
            });

            var checkColumn = Ext.create('Ext.grid.column.Check', {
                text: t("export"),
                dataIndex: 'checked',
                width: 50
            });

            this.gridPanel = new Ext.grid.Panel({
                autoScroll: true,
                trackMouseOver: true,
                store: store,
                features: [
                    Ext.create('Ext.grid.feature.Grouping', {
                        groupHeaderTpl: t("type") + " " + '{name}'
                    })
                ],
                autoExpandColumn: "bulk_export_defintion_name",
                columnLines: true,
                stripeRows: true,
                tbar: [
                    {
                        xtype: "button",
                        text: t('select_all'),
                        handler: this.selectAll.bind(this, 1)
                    },
                    '-',
                    {
                        xtype: "button",
                        text: t('deselect_all'),
                        handler: this.selectAll.bind(this, 0)
                    }
                ],
                columns: [
                    checkColumn,
                    {
                        text: t("type"),
                        dataIndex: 'type',
                        editable: false,
                        hidden: true,
                        width: 40,
                        sortable: true
                    },
                    {
                        text: t("type"),
                        dataIndex: 'icon',
                        editable: false,
                        width: 40,
                        renderer: this.getTypeRenderer.bind(this),
                        sortable: true
                    },
                    {
                        text: t('name'),
                        dataIndex: 'displayName',
                        id: "bulk_export_defintion_name",
                        editable: false,
                        flex: 1,
                        sortable: true
                    }

                ],
                viewConfig: {
                    forceFit: true
                }
            });

            this.window = new Ext.Window({
                title: t('bulk_export'),
                width: 800,
                height: 500,
                border: false,
                modal: true,
                layout: "fit",
                iconCls: "opendxp_icon_import",
                items: [this.gridPanel],
                bbar: ["->",
                    {
                        xtype: "button",
                        text: t("close"),
                        iconCls: "opendxp_icon_cancel",
                        handler: function () {
                            this.window.close();
                        }.bind(this)
                    },
                    {
                        xtype: "button",
                        iconCls: "opendxp_icon_export",
                        text: t('export'),
                        handler: this.applyData.bind(this)
                    }
                ]

            });
        }

        this.window.show();
        return this.window;
    },

    applyData: function() {
        var store = this.gridPanel.getStore();
        var records = store.getRange();
        this.values = [];

        for (var i = 0; i < records.length; i++) {
            var currentData = records[i];

            if (!currentData.data.checked) {
                continue;
            }
            this.values.push({
                type: currentData.data.type,
                name: currentData.data.name,
            });
        }

        this.sortValues();

        Ext.Ajax.request({
            url: Routing.generate('opendxp_admin_dataobject_class_bulkexportprepare'),
            method: "post",
            params: {
                data: JSON.stringify(this.values)
            },
            success: function(transport){
                var data = Ext.decode(transport.responseText);

                if (data.success) {
                    var url = Routing.generate('opendxp_admin_dataobject_class_dobulkexport');
                    opendxp.settings.showCloseConfirmation = false;
                    window.setTimeout(function () {
                        opendxp.settings.showCloseConfirmation = true;
                    },1000);

                    this.window.close();
                    location.href = url;
                }
            }.bind(this)
        });
    }
});
