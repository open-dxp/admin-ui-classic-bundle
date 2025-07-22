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

opendxp.registerNS("opendxp.layout.portlets.modificationStatistic");
/**
 * @private
 */
opendxp.layout.portlets.modificationStatistic = Class.create(opendxp.layout.portlets.abstract, {

    getType: function () {
        return "opendxp.layout.portlets.modificationStatistic";
    },

    getName: function () {
        return t("modification_statistic");
    },

    getIcon: function () {
        return "opendxp_icon_portlet_modification_statistic";
    },

    getLayout: function (portletId) {

        var store = new Ext.data.Store({
            autoDestroy: true,
            proxy: {
                type: 'ajax',
                url: Routing.generate('opendxp_admin_portal_portletmodificationstatistics'),
                reader: {
                    type: 'json',
                    rootProperty: 'data'
            }},
            fields: ['timestamp','datetext',"objects",'documents',"assets"]
        });

        store.load();


        var panel = new Ext.Panel({
            layout:'fit',
            height: 275,
            items: {
                xtype: 'cartesian',
                downloadServerUrl: '/disabled-server-url/',
                store: store,
                legend: {
                    docked: 'right'
                },
                interactions: ['itemhighlight',
                    {
                        type: 'panzoom',
                        zoomOnPanGesture: true
                    }
                ],
                axes: [{
                    type: 'numeric',
                    fields: ['documents', 'assets', 'objects' ],
                    position: 'left',
                    grid: true,
                    minimum: 0
                }
                    , {
                    type: 'category',
                    fields: 'datetext',
                    position: 'bottom'
                }
                ],
                series: [
                    {
                        type: 'line',
                        axis:' left',
                        title: t('documents'),
                        xField: 'datetext',
                        yField: 'documents',
                        colors: ['#01841c'],
                        style: {
                            lineWidth: 2,
                            stroke: '#01841c'
                        },
                        marker: {
                            radius: 4,
                            fillStyle: '#01841c'
                        },
                        highlight: {
                            fillStyle: '#000',
                            radius: 5,
                            lineWidth: 2,
                            strokeStyle: '#fff'
                        },
                        tooltip: {
                            trackMouse: true,
                            style: 'background: #01841c',
                            renderer: function(tooltip, storeItem, item) {
                                var title = item.series.getTitle();
                                tooltip.setHtml(title + ' for ' + storeItem.get('datetext') + ': ' + storeItem.get(item.series.getYField()));
                            }
                        }
                    },
                    {
                        type:'line',
                        axis:' left',
                        title: t('assets'),
                        xField: 'datetext',
                        yField: 'assets',
                        colors: ['#15428B'],
                        style: {
                            lineWidth: 2,
                            stroke: '#15428B'
                        },
                        marker: {
                            radius: 4,
                            fillStyle: '#15428B'
                        },
                        highlight: {
                            fillStyle: '#000',
                            radius: 5,
                            lineWidth: 2,
                            strokeStyle: '#fff'
                        },
                        tooltip: {
                            trackMouse: true,
                            style: 'background: #00bfff',
                            renderer: function(tooltip, storeItem, item) {
                                var title = item.series.getTitle();
                                tooltip.setHtml(title + ' for ' + storeItem.get('datetext') + ': ' + storeItem.get(item.series.getYField()));
                            }
                        }
                    },
                    {
                        type:'line',
                        axis:' left',
                        title: t('data_objects'),
                        xField: 'datetext',
                        yField: 'objects',
                        colors: ['#ff6600'],
                        style: {
                            lineWidth: 2,
                            stroke: '#ff6600'
                        },
                        marker: {
                            radius: 4,
                            fillStyle: '#ff6600',
                            strokeStyle: '#ff6600'
                        },
                        highlight: {
                            fillStyle: '#000',
                            radius: 5,
                            lineWidth: 2,
                            strokeStyle: '#fff'
                        },
                        tooltip: {
                            trackMouse: true,
                            style: 'background: #ff6600',
                            renderer: function(tooltip, storeItem, item) {
                                var title = item.series.getTitle();
                                tooltip.setHtml(title + ' for ' + storeItem.get('datetext') + ': ' + storeItem.get(item.series.getYField()));
                            }
                        }

                    },

                ]
            }
        });


        this.layout = Ext.create('Portal.view.Portlet', Object.assign(this.getDefaultConfig(), {
            title: this.getName(),
            iconCls: this.getIcon(),
            height: 275,
            layout: "fit",
            items: [panel]
        }));

        this.layout.portletId = portletId;
        return this.layout;
    }
});
