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

opendxp.registerNS("opendxp.layout.portlets.modifiedObjects");
/**
 * @private
 */
opendxp.layout.portlets.modifiedObjects = Class.create(opendxp.layout.portlets.abstract, {

    getType: function () {
        return "opendxp.layout.portlets.modifiedObjects";
    },


    getName: function () {
        return t("modified_objects");
    },

    getIcon: function () {
        return "opendxp_icon_object";
    },

    getLayout: function (portletId) {

        var store = new Ext.data.Store({
            autoDestroy: true,
            proxy: {
                type: 'ajax',
                url: Routing.generate('opendxp_admin_portal_portletmodifiedobjects'),
                reader: {
                    type: 'json',
                    rootProperty: 'objects'
                }
            },
            fields: ['id','path',"type",'date']
        });

        store.load();

        var grid = Ext.create('Ext.grid.Panel', {
            store: store,
            columns: [
                {text: t('path'), sortable: false, dataIndex: 'path', flex: 1},
                {text: t('date'), width: 150, sortable: false, renderer: function (d) {
                    var date = new Date(d * 1000);
                    return Ext.Date.format(date, opendxp.globalmanager.get('localeDateTime').getDateTimeFormat());
                }, dataIndex: 'date'}

            ],
            stripeRows: true,
            autoExpandColumn: 'path'
        });

        grid.on("rowclick", function(grid, record, tr, rowIndex, e, eOpts ) {
            var data = grid.getStore().getAt(rowIndex);

            opendxp.helpers.openObject(data.data.id, data.data.type);
        });


        this.layout = Ext.create('Portal.view.Portlet', Object.assign(this.getDefaultConfig(), {
            title: this.getName(),
            iconCls: this.getIcon(),
            height: 275,
            layout: "fit",
            items: [grid]
        }));

        this.layout.portletId = portletId;
        return this.layout;
    }

});
