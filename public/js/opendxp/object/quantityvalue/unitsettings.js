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

opendxp.registerNS("opendxp.object.quantityValue.unitsettings");
/**
 * @private
 */
opendxp.object.quantityValue.unitsettings = Class.create({

    initialize: function () {
        this.getTabPanel();
    },
    getUploadUrl: function() {
        return Routing.generate('opendxp_admin_dataobject_quantityvalue_unitimport');
    },
    getExportUrl: function() {
        return Routing.generate('opendxp_admin_dataobject_quantityvalue_unitexport');
    },
    activate: function (filter) {
        if(filter){
            this.store.baseParams.filter = filter;
            this.store.load();
            this.filterField.setValue(filter);
        }
        const tabPanel = Ext.getCmp("opendxp_panel_tabs");
        tabPanel.setActiveItem("quantityValue_units");
    },

    getHint: function(){
        return "";
    },

    getTabPanel: function () {
        if (!this.panel) {
            this.panel = new Ext.Panel({
                id: "quantityValue_units",
                iconCls: "opendxp_icon_quantityValue",
                title: t("quantityValue_units"),
                border: false,
                layout: "fit",
                closable:true,
                items: [this.getRowEditor()]
            });

            const tabPanel = Ext.getCmp("opendxp_panel_tabs");
            tabPanel.add(this.panel);
            tabPanel.setActiveItem("quantityValue_units");

            this.panel.on("destroy", function () {
                opendxp.globalmanager.remove("quantityValue_units");
            }.bind(this));

            opendxp.layout.refresh();
        }

        return this.panel;
    },


    getRowEditor: function () {
        let fields = [{
            name: 'id',
            type: 'string'
        }, 'abbreviation', 'longname', 'group', 'baseunit', 'factor', 'conversionOffset', 'reference', 'converter'];

        const baseUnitStore = Ext.create('Ext.data.JsonStore', {
            fields: fields,
            proxy: {
                type: 'ajax',
                async: true,
                batchActions: false,
                url: Routing.generate('opendxp_admin_dataobject_quantityvalue_unitproxyget'),
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }

            },
            // disable client pagination, default: 25
            pageSize: 0,
            listeners: {
                load: function (store, records) {
                    const storeData = records;
                    storeData.unshift({'id': -1, 'abbreviation' : "(" + t("empty") + ")"});
                    store.loadData(storeData);
                }
            }
        });
        baseUnitStore.load();

        const baseUnitEditor = {
            xtype: 'combobox',
            triggerAction: "all",
            autoSelect: true,
            editable: true,
            selectOnFocus: true,
            forceSelection: true,
            valueField: 'id',
            displayField: 'abbreviation',
            queryMode: 'local',
            store: baseUnitStore
        };

        const typesColumns = [
            {flex: 1, dataIndex: 'id', text: t("id"), filter: 'string'},
            {flex: 1, dataIndex: 'abbreviation', text: t("abbreviation"), editor: new Ext.form.TextField({}), filter: 'string'},
            {flex: 2, dataIndex: 'longname', text: t("longname"), editor: new Ext.form.TextField({}), filter: 'string'},
            {flex: 1, dataIndex: 'group', text: t("group"), editor: new Ext.form.TextField({}), filter: 'string', hidden: true},
            {flex: 1, dataIndex: 'baseunit', text: t("baseunit"), editor: baseUnitEditor, renderer: function(value){
                    if(!value) {
                        return '('+t('empty')+')';
                    }

                    const baseUnit = baseUnitStore.getById(value);
                    if(!baseUnit) {
                        return '('+t('empty')+')';
                    }
                    return baseUnit.get('abbreviation');
                }},
            {flex: 1, dataIndex: 'factor', text: t("conversionFactor"), editor: new Ext.form.NumberField({decimalPrecision: 10}), filter: 'numeric'},
            {flex: 1, dataIndex: 'conversionOffset', text: t("conversionOffset"), editor: new Ext.form.NumberField({decimalPrecision: 10}), filter: 'numeric'},
            {flex: 1, dataIndex: 'reference', text: t("reference"), editor: new Ext.form.TextField({}), hidden: true, filter: 'string'},
            {flex: 1, dataIndex: 'converter', text: t("converter_service"), editor: new Ext.form.TextField({}), filter: 'string'}
        ];

        typesColumns.push({
            hideable: false,
            xtype: 'actioncolumn',
            menuText: t('delete'),
            width: 30,
            items: [{
                tooltip: t('delete'),
                iconCls: "opendxp_icon_delete",
                handler: function (grid, rowIndex) {
                    Ext.Msg.confirm(t('warning'), t('delete_quantity_value_unit_confirmation'), function(btn){
                        if (btn === 'yes'){
                            grid.getStore().removeAt(rowIndex);
                        }
                    });
                }.bind(this)
            }]
        });

        const itemsPerPage = opendxp.helpers.grid.getDefaultPageSize(-1);

        this.store = new Ext.data.Store({
            proxy: {
                type: 'ajax',
                url: Routing.generate('opendxp_admin_dataobject_quantityvalue_unitproxyget'),
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total',
                    successProperty: 'success'
                },
                writer: {
                    type: 'json',
                    writeAllFields: true,
                    rootProperty: 'data',
                    encode: 'true'
                },
                api: {
                    create  : Routing.generate('opendxp_admin_dataobject_quantityvalue_unitproxyget', {xaction: 'create'}),
                    read    : Routing.generate('opendxp_admin_dataobject_quantityvalue_unitproxyget', {xaction: 'read'}),
                    update  : Routing.generate('opendxp_admin_dataobject_quantityvalue_unitproxyget', {xaction: 'update'}),
                    destroy : Routing.generate('opendxp_admin_dataobject_quantityvalue_unitproxyget', {xaction: 'destroy'})
                },
                pageSize: itemsPerPage
            },
            fields: fields,
            remoteSort: true,
            remoteFilter: true,
            autoSync: true,
            listeners: {
                "load": function () {
                    try {
                        baseUnitStore.reload({
                            page: this.store.currentPage,
                            start: 0,
                            limit: 9999
                        });
                        Ext.apply(baseUnitStore, {pageSize: this.pagingtoolbar.pageSize});
                    }
                    catch (e) {
                    }
                }.bind(this),
                update: function() {
                    opendxp.helpers.quantityValue.getClassDefinitionStore().reload();
                    baseUnitStore.reload();
                    if (opendxp.helpers.quantityValue.store) {
                        // remote call could be avoided by updating the store directly
                        opendxp.helpers.quantityValue.store.reload();
                    }
                }
            }
        });
        this.store.load();

        this.pagingtoolbar = opendxp.helpers.grid.buildDefaultPagingToolbar(this.store, {pageSize: itemsPerPage});

        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToEdit: 1,
            clicksToMoveEditor: 1,
        });

        this.grid = new Ext.grid.GridPanel({
            frame: false,
            autoScroll: true,
            store: this.store,
            plugins: ['opendxp.gridfilters', this.rowEditing],
            columnLines: true,
            stripeRows: true,
            columns : {
                items: typesColumns,
                defaults: {
                    renderer: Ext.util.Format.htmlEncode
                }
            },
            bbar: this.pagingtoolbar,
            selModel: Ext.create('Ext.selection.RowModel', {}),
            tbar: {
                cls: 'opendxp_main_toolbar',
                items: [
                    {
                        text: t('add'),
                        handler: this.onAdd.bind(this),
                        iconCls: "opendxp_icon_add"
                    },
                    '-',
                    {
                        text: t('delete'),
                        handler: this.onDelete.bind(this),
                        iconCls: "opendxp_icon_minus"
                    },
                    '-',
                    {
                        text: t('reload'),
                        handler: function () {
                            this.store.reload();
                        }.bind(this),
                        iconCls: "opendxp_icon_reload"
                    },
                    '-',
                    {
                        text: t('import'),
                        handler: function () {
                            opendxp.helpers.uploadDialog(this.getUploadUrl(), "Filedata", function() {
                                this.store.reload();
                                opendxp.layout.refresh();
                            }.bind(this), function () {
                                Ext.MessageBox.alert(t("error"), t("error"));
                            });
                        }.bind(this),
                        iconCls: "opendxp_icon_upload"
                    },
                    '-',
                    {
                        text: t('export'),
                        handler: function () {
                            opendxp.helpers.download(this.getExportUrl());
                        }.bind(this),
                        iconCls: "opendxp_icon_download"
                    },
                    '-',
                    {
                        text: this.getHint(),
                        xtype: "tbtext",
                        style: "margin: 0 10px 0 0;"
                    }
                ]
            },
            viewConfig: {
                forceFit: true
            }
        });

        return this.grid;
    },

    onAdd: function (btn, ev) {
        Ext.MessageBox.prompt(' ', t('unique_identifier'),
            function (button, value, object) {
                const regresult = value.match(/[a-zA-Z0-9_\-]+/);
                if (button == "ok") {
                    if (value.length >= 1 && regresult == value) {

                        // this is rather a workaround, Ext doesn't sync if the id field is already filled.
                        Ext.Ajax.request({
                            url: Routing.generate('opendxp_admin_dataobject_quantityvalue_unitproxyget', {xaction: 'create'}),
                            method: 'POST',
                            params: {
                                data: Ext.encode({
                                    id: value
                                })
                            },
                            success: function () {
                                const u = {
                                    id: value
                                };
                                this.rowEditing.completeEdit();
                                this.grid.store.insert(0, [u]);

                                this.rowEditing.startEdit(0,0);

                            }.bind(this)
                        });

                    } else {
                        Ext.Msg.alert(' ', t('failed_to_create_new_item'));
                    }
                }
            }.bind(this)
        );

    },

    onDelete: function () {
        Ext.Msg.confirm(t('warning'), t('delete_quantity_value_unit_confirmation'), function(btn){
            if (btn === 'yes'){
                const selections = this.grid.getSelectionModel().getSelected();
                if (!selections || selections.length < 1) {
                    return false;
                }
                const rec = selections.getAt(0);
                this.grid.store.remove(rec);
            }
        }.bind(this));
    }
});
