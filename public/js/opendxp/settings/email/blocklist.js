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

opendxp.registerNS("opendxp.settings.email.blocklist");
/**
 * @private
 */
opendxp.settings.email.blocklist = Class.create({

    initialize:function () {

        this.getTabPanel();
    },

    activate:function () {
        var tabPanel = Ext.getCmp("opendxp_panel_tabs");
        tabPanel.setActiveItem("email_blocklist");
    },

    getTabPanel:function () {

        if (!this.panel) {
            this.panel = new Ext.Panel({
                id:"email_blocklist",
                title:t("email_blocklist"),
                iconCls:"opendxp_icon_email opendxp_icon_overlay_delete",
                border:false,
                layout:"fit",
                closable:true,
                items:[this.getRowEditor()]
            });

            var tabPanel = Ext.getCmp("opendxp_panel_tabs");
            tabPanel.add(this.panel);
            tabPanel.setActiveItem("email_blocklist");


            this.panel.on("destroy", function () {
                opendxp.globalmanager.remove("email_blocklist");
            }.bind(this));

            opendxp.layout.refresh();
        }

        return this.panel;
    },

    getRowEditor:function () {

        var itemsPerPage = opendxp.helpers.grid.getDefaultPageSize();
        var url = Routing.generate('opendxp_admin_email_blocklist');

        this.store = opendxp.helpers.grid.buildDefaultStore(
            url,
            [
                {name:'address', allowBlank: false},
                {name:'creationDate'},
                {name:'modificationDate'}
            ],
            itemsPerPage
        );


        this.filterField = new Ext.form.TextField({
            xtype:"textfield",
            width:200,
            style:"margin: 0 10px 0 0;",
            enableKeyEvents:true,
            listeners:{
                "keydown":function (field, key) {
                    if (key.getKey() == key.ENTER) {
                        var input = field;
                        var proxy = this.store.getProxy();
                        proxy.extraParams.filter = input.getValue();
                        this.store.load();
                    }
                }.bind(this)
            }
        });

        this.pagingtoolbar = opendxp.helpers.grid.buildDefaultPagingToolbar(this.store);

        var typesColumns = [
            {text:t("email_address"), flex:50, sortable:true, dataIndex:'address', editable: false},
            {text: t("creationDate"), sortable: true, dataIndex: 'creationDate', editable: false,
                hidden: false,
                width: 150,
                renderer: function(d) {
                    if (d !== undefined) {
                        var date = new Date(d * 1000);
                        return Ext.Date.format(date, opendxp.globalmanager.get('localeDateTime').getDateTimeFormat());
                    } else {
                        return "";
                    }
                }
            },
            {text: t("modificationDate"), sortable: true, dataIndex: 'modificationDate', editable: false,
                hidden: true,
                width: 150,
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
                xtype:'actioncolumn',
                menuText:t('delete'),
                width:30,
                items:[
                    {
                        tooltip:t('delete'),
                        icon:"/bundles/opendxpadmin/img/flat-color-icons/delete.svg",
                        handler:function (grid, rowIndex) {
                            let data = grid.getStore().getAt(rowIndex);
                            const sanitizedEmail = opendxp.helpers.sanitizeEmail(data.data.address);

                            opendxp.helpers.deleteConfirm(
                                t('email_blocklist'),
                                sanitizedEmail,
                                function () {
                                    grid.getStore().removeAt(rowIndex);
                                }.bind(this)
                            );
                        }.bind(this)
                    }
                ]
            }
        ];

        this.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });

        var toolbar = Ext.create('Ext.Toolbar', {
            cls: 'opendxp_main_toolbar',
            items: [
                {
                    text:t('add'),
                    handler:this.onAdd.bind(this),
                    iconCls:"opendxp_icon_add"
                },
                "->",
                {
                    text:t("filter") + "/" + t("search"),
                    xtype:"tbtext",
                    style:"margin: 0 10px 0 0;"
                },
                this.filterField
            ]
        });

        this.grid = Ext.create('Ext.grid.Panel', {
            frame:false,
            autoScroll:true,
            store:this.store,
            columnLines:true,
            trackMouseOver:true,
            stripeRows:true,
            columns: {
                items: typesColumns,
                defaults: {
                    renderer: Ext.util.Format.htmlEncode
                },
            },
            selModel: Ext.create('Ext.selection.RowModel', {}),
            plugins: [
                this.cellEditing
            ],
            bbar:this.pagingtoolbar,
            tbar: toolbar,
            viewConfig:{
                forceFit:true
            }
        });

        return this.grid;
    },


    onAdd:function (btn, ev) {
        Ext.MessageBox.prompt("", t("email_address"), function (button, value) {
            if(button == "ok") {
                const sanitizedEmail = opendxp.helpers.sanitizeEmail(value);

                var u = {
                    "address": sanitizedEmail
                };

                this.grid.store.insert(0, u);
            }

        }.bind(this));
    }
});
