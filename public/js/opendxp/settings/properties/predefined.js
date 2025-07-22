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

opendxp.registerNS("opendxp.settings.properties.predefined");
/**
 * @private
 */
opendxp.settings.properties.predefined = Class.create({

    initialize: function () {
        this.getTabPanel();
    },

    activate: function () {
        var tabPanel = Ext.getCmp("opendxp_panel_tabs");
        tabPanel.setActiveItem("predefined_properties");
    },

    getTabPanel: function () {

        if (!this.panel) {
            this.panel = new Ext.Panel({
                id: "predefined_properties",
                title: t("predefined_properties"),
                iconCls: "opendxp_icon_properties",
                border: false,
                layout: "fit",
                closable:true,
                items: [this.getRowEditor()]
            });

            var tabPanel = Ext.getCmp("opendxp_panel_tabs");
            tabPanel.add(this.panel);
            tabPanel.setActiveItem("predefined_properties");


            this.panel.on("destroy", function () {
                opendxp.globalmanager.remove("predefined_properties");
            }.bind(this));

            opendxp.layout.refresh();
        }

        return this.panel;
    },

    getRowEditor: function () {

        var url = Routing.generate('opendxp_admin_settings_properties');

        this.store = opendxp.helpers.grid.buildDefaultStore(
            url,
            ['id',

                {name: 'name', allowBlank: false},'description',
                {name: 'key', allowBlank: false},
                {name: 'type', allowBlank: false}, 'data', 'config',
                {name: 'ctype', allowBlank: false}, 'inheritable', 'creationDate', 'modificationDate'

            ], null, {
                remoteSort: false,
                remoteFilter: false
            }
        );
        this.store.setAutoSync(true);

        this.filterField = new Ext.form.TextField({
            width: 200,
            style: "margin: 0 10px 0 0;",
            enableKeyEvents: true,
            listeners: {
                "keydown" : function (field, key) {
                    if (key.getKey() == key.ENTER) {
                        var input = field;
                        var proxy = this.store.getProxy();
                        proxy.extraParams.filter = input.getValue();
                        this.store.load();
                    }
                }.bind(this)
            }
        });

        var inheritableCheck = new Ext.grid.column.Check({
            text: t("inheritable"),
            dataIndex: "inheritable",
            editor: {
                xtype: 'checkbox',
            },
            width: 50
        });

        var contentTypesStore = Ext.create('Ext.data.ArrayStore', {
            fields: ['value', 'text'],
            data: [
                ['document', 'document'],
                ['asset', 'asset'],
                ['object', 'object']
            ],
            autoLoad: true
        });


        var propertiesColumns = [
            {
                text: t("name"),
                flex: 100,
                sortable: true,
                dataIndex: 'name',
                editor: new Ext.form.TextField()
            },
            {
                text: t("description"),
                sortable: true,
                dataIndex: 'description',
                editor: new Ext.form.TextArea(),
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                    if(empty(value)) {
                        return "";
                    }
                    return nl2br(Ext.util.Format.htmlEncode(value));
               }
            },
            {
                text: t("key"),
                flex: 50,
                sortable: true,
                dataIndex: 'key',
                editor: new Ext.form.TextField()
            },
            {
                text: t("type"),
                flex: 50,
                sortable: true,
                dataIndex: 'type',
                editor: new Ext.form.ComboBox({
                    triggerAction: 'all',
                    editable: false,
                    store: ["text","document","asset","object","bool","select"]

                })
            },
            {
                text: t("value"),
                flex: 50,
                sortable: true,
                dataIndex: 'data',
                editor: new Ext.form.TextField()
            },
            {
                text: t("configuration"),
                flex: 50,
                sortable: false,
                dataIndex: 'config',
                editor: new Ext.form.TextField()
            },
            {
                text: t("content_type"),
                flex: 50,
                sortable: true,
                dataIndex: 'ctype',
                editor: new Ext.ux.form.MultiSelect({
                    store: new Ext.data.ArrayStore({
                        fields: ['key', {
                            name: 'value',
                            convert: function (v, r) {
                                if (Array.isArray(v)) {
                                    return v.join(";");
                                }
                                return v;
                            }
                        }],
                        data: [
                            ['document', 'document'],
                            ['object', ['object']],
                            ['asset', ['asset']]
                        ],
                    }),
                    displayField: 'key',
                    valueField: 'value',
                }),
            },
            inheritableCheck,
            {
                xtype: 'actioncolumn',
                menuText: t('delete'),
                width: 30,
                items: [{
                    getClass: function(v, meta, rec) {
                      var klass = "opendxp_action_column ";
                      if(rec.data.writeable) {
                          klass += "opendxp_icon_minus";
                      }
                      return klass;
                    },
                    tooltip: t('delete'),
                    handler: function (grid, rowIndex) {
                        let data = grid.getStore().getAt(rowIndex);
                        opendxp.helpers.deleteConfirm(t('predefined_properties'),
                            Ext.util.Format.htmlEncode(data.data.name),
                            function () {
                            grid.getStore().removeAt(rowIndex);
                        }.bind(this));
                    }.bind(this)
                }]
            },
            {
                xtype: 'actioncolumn',
                menuText: t('translate'),
                width: 30,
                items: [{
                    tooltip: t('translate'),
                    icon: "/bundles/opendxpadmin/img/flat-color-icons/collaboration.svg",
                    handler: function(grid, rowIndex){
                        var rec = grid.getStore().getAt(rowIndex);
                        try {
                            opendxp.globalmanager.get("translationdomainmanager").activate(rec.data.name);
                        } catch (e) {
                            opendxp.globalmanager.add("translationdomainmanager",
                                new opendxp.settings.translation.domain("admin", rec.data.name));
                        }
                    }.bind(this)
                }]
            },
            {
                text: t("creationDate"),
                sortable: true,
                dataIndex: 'creationDate',
                editable: false,
                hidden: true,
                renderer: function(d) {
                    if (d !== undefined) {
                        var date = new Date(d * 1000);
                        return Ext.Date.format(date, opendxp.globalmanager.get('localeDateTime').getDateTimeFormat());
                    } else {
                        return "";
                    }
                }
            },
            {
                text: t("modificationDate"),
                sortable: true,
                dataIndex: 'modificationDate',
                editable: false,
                hidden: true,
                renderer: function(d) {
                    if (d !== undefined) {
                        var date = new Date(d * 1000);
                        return Ext.Date.format(date, opendxp.globalmanager.get('localeDateTime').getDateTimeFormat());
                    } else {
                        return "";
                    }
                }
            }
        ];

        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToEdit: 1,
            clicksToMoveEditor: 1,
            listeners: {
                beforeedit: function (editor, context, eOpts) {
                    if (!context.record.data.writeable) {
                        return false;
                    }
                }
            }
        });

        this.grid = Ext.create('Ext.grid.Panel', {
            frame: false,
            autoScroll: true,
            store: this.store,
            columnLines: true,
            bodyCls: "opendxp_editable_grid",
            stripeRows: true,
            trackMouseOver: true,
            columns: {
                items: propertiesColumns,
                defaults: {
                    renderer: Ext.util.Format.htmlEncode
                },
            },
            selModel: Ext.create('Ext.selection.RowModel', {}),
            plugins: [
                this.rowEditing
            ],
            tbar: {
                cls: 'opendxp_main_toolbar',
                items: [
                    {
                        text: t('add'),
                        handler: this.onAdd.bind(this),
                        iconCls: "opendxp_icon_add",
                        disabled: !opendxp.settings['predefined-properties-writeable']
                    },"->",{
                        text: t("filter") + "/" + t("search"),
                        xtype: "tbtext",
                        style: "margin: 0 10px 0 0;"
                    },
                    this.filterField
                ]
            },
            viewConfig: {
                forceFit: true,
                getRowClass: function (record, rowIndex) {
                    return record.data.writeable ? '' : 'opendxp_grid_row_disabled';
                }
            }
        });

        return this.grid;
    },

    onAdd: function (btn, ev) {
        this.grid.store.insert(0, {
            name: t('new_property'),
            key: "new_key",
            ctype: "document",
            type: "text"
        });
    }
});
