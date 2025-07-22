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

opendxp.registerNS("opendxp.settings.translation.translationmerger");
/**
 * @private
 */
opendxp.settings.translation.translationmerger = Class.create({


    initialize: function (domain, mergeResult, callback) {
        this.domain = domain;
        var delta = mergeResult.delta;
        delta = base64_decode(delta);
        delta = Ext.decode(delta);

        if (delta.length == 0) {
            opendxp.helpers.showNotification(t("info"), t("nothing_to_merge"), "info");
            return;
        }

        this.delta = delta;
        this.languages = mergeResult.languages;
        this.callback = callback;

        this.store = new Ext.data.Store({
            proxy: {
                type: 'memory'
            },
            autoDestroy: true,
            sortInfo: {
                field: 'key',
                direction: 'ASC'

            },
            data: this.delta,
            fields: ['lg', 'lgname', 'icon', 'key', 'text', 'current', 'csv', 'dirty']
        });

        this.getTabPanel();
    },


    getTabPanel: function () {

        if (!this.panel) {


            var toolbar = Ext.create('Ext.Toolbar', {
                cls: 'opendxp_main_toolbar',
                items: [
                    {
                        text: t('apply'),
                        handler: this.applyAll.bind(this),
                        iconCls: "opendxp_icon_arrow_right"
                    },
                    {
                        text: t('revert'),
                        handler: this.revertAll.bind(this),
                        iconCls: "opendxp_icon_revert"
                    }
                ]
            });


            this.layout = new Ext.grid.GridPanel({
                store: this.store,
                plugins: ['gridfilters'],
                columns: [
                    {text: t("language"), sortable: true, dataIndex: 'lgname', editable: false},
                    {
                        text: "&nbsp;", sortable: true, dataIndex: 'icon', editable: false, width: 40,
                        renderer: function (data) {
                            return '<img src="' + data + '" width="100%" height="auto" alt="" />';
                        }
                    },
                    {text: t("key"), sortable: true, dataIndex: 'key', editable: false, flex: 150, filter: 'string'},
                    {
                        text: t("translation_merger_csv"),
                        sortable: true,
                        dataIndex: 'csv',
                        editable: false,
                        flex: 200,
                        filter: 'string'
                    },
                    {
                        text: t("action"),
                        menuText: t("action"),
                        xtype: 'actioncolumn',
                        width: 80,
                        tooltip: t('action'),
                        items: [
                            {
                                getClass: function (v, meta, rec) {
                                    switch (rec.get('dirty')) {
                                        case 1:
                                            return 'opendxp_icon_revert opendxp_action_column';
                                        case -1:
                                            return 'opendxp_icon_hourglass opendxp_action_column';
                                        default:
                                            return 'opendxp_icon_arrow_right opendxp_action_column';

                                    }
                                },

                                handler: function (grid, rowIndex, colIndex) {
                                    var rec = this.store.getAt(rowIndex);
                                    var state = rec.get("dirty");
                                    var current = rec.get("current");
                                    var newState;

                                    if (state == 1) {
                                        newState = 0;
                                    } else {
                                        newState = 1;
                                    }
                                    if (state == 1) {
                                        rec.set("dirty", -1);
                                        rec.set("current", rec.get("text"));
                                    } else if (state != -1) {
                                        rec.set("dirty", -1);
                                        var valueFromCsv = rec.get("csv");
                                        rec.set("current", valueFromCsv);
                                    }


                                    if (rec.get("dirty") == -1) {
                                        var newData = Ext.encode([rec.data]);
                                        Ext.Ajax.request({
                                            url: Routing.generate('opendxp_admin_translation_mergeitem'),
                                            method: "PUT",
                                            params: {
                                                data: newData,
                                                domain: this.domain
                                            },
                                            success: function (response) {
                                                var result = Ext.decode(response.responseText);
                                                if (result.success) {
                                                    rec.set("dirty", newState);
                                                } else {
                                                    rec.set("dirty", state);
                                                    rec.set("current", current);
                                                }
                                            }.bind(this)
                                        });
                                    }


                                }.bind(this)
                            }
                        ]
                    },

                    {
                        text: t("translation_merger_current"),
                        sortable: true,
                        dataIndex: 'current',
                        editable: false,
                        flex: 200,
                        filter: 'string'
                    }
                ],
                viewConfig: {
                    forceFit: true,
                    markDirty: false
                },
                cls: "translationmerger"
            });

            this.panel = new Ext.Panel({
                title: t("merge_translations") + " (Domain: " + this.domain + ")",
                iconCls: "opendxp_icon_translations",
                border: false,
                layout: "fit",
                closable: true,
                tbar: toolbar

            });

            var tabPanel = Ext.getCmp("opendxp_panel_tabs");
            tabPanel.add(this.panel);

            tabPanel.setActiveItem(this.panel.getId());

            this.panel.add(this.layout);
            opendxp.layout.refresh();

            this.layout.updateLayout();

        }

        return this.panel;
    },

    activate: function () {
        var tabPanel = Ext.getCmp("opendxp_panel_tabs");
        tabPanel.setActiveItem(this.panel.getId());
    },

    batchUpdate: function (newState) {
        var count = this.store.count();
        var newData = [];
        var newText = newState == 1 ? "csv" : "text";        // "csv" or "text"

        for (i = 0; i < count; i++) {
            var rec = this.store.getAt(i);
            var dirty = rec.get("dirty");
            if (rec.get("dirty") == -1) {
                continue;
            }

            if (typeof dirty == "undefined") {
                dirty = 0;
            }
            if (dirty != newState) {
                rec.set("dirty", -1);
                rec.set("current", rec.get(newText));
                newData.push(rec.getData());
            }
        }

        if (newData.length > 0) {
            var encodedData = Ext.encode(newData);
            Ext.Ajax.request({
                url: Routing.generate('opendxp_admin_translation_mergeitem'),
                method: "PUT",
                params: {
                    data: encodedData,
                    domain: this.domain
                },
                success: function (response) {
                    var result = Ext.decode(response.responseText);
                    if (result.success) {
                        for (i = 0; i < newData.length; i++) {
                            var recordData = newData[i];
                            var rec = this.store.getById(recordData.id);
                            rec.set("dirty", newState);
                        }

                        opendxp.helpers.showNotification(t("success"), t("batch_applied"), "success");
                    }
                }.bind(this)
            });
        }
    },

    applyAll: function () {
        this.batchUpdate(1);
    },

    revertAll: function () {
        this.batchUpdate(0);
    }
});
