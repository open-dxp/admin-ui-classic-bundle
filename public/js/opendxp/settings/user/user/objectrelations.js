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


opendxp.registerNS("opendxp.settings.user.user.objectrelations");
/**
 * @private
 */
opendxp.settings.user.user.objectrelations = Class.create({

    initialize: function (userPanel) {
        this.userPanel = userPanel;

        this.data = this.userPanel.data;
    },

    getPanel: function () {

        this.objectDependenciesStore = new Ext.data.JsonStore({
            autoDestroy: true,
            proxy: {
                type: 'memory',
                reader: {
                    rootProperty: 'dependencies'
                }
            },
            data: this.data.objectDependencies,
            fields: ['id', 'path', 'subtype']
        });

        this.objectDependenciesGrid = new Ext.grid.GridPanel({
            store: this.objectDependenciesStore,
            columns: [
                {text: "ID", sortable: true, dataIndex: 'id'},
                {text: t("path"), sortable: true, dataIndex: 'path', flex: 1},
                {text: t("subtype"), sortable: true, dataIndex: 'subtype'}
            ],
            columnLines: true,
            stripeRows: true,
            autoHeight: true,
            title: t('user_object_dependencies_description')
        });
        this.objectDependenciesGrid.on("rowclick", function(grid, index){
                var d = grid.getStore().getAt(index).data;
                opendxp.helpers.openObject(d.id, "object");

        });

        this.hiddenNote = new Ext.Panel({
            html:t('hidden_dependencies'),
            cls:'dependency-warning',
            border:false,
            hidden: !this.data.objectDependencies.hasHidden
        });

        this.panel = new Ext.Panel({
            title: t("user_object_dependencies_description"),
            items: [this.hiddenNote, this.objectDependenciesGrid]
        });

        return this.panel;
    }
});