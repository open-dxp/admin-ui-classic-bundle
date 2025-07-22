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

opendxp.registerNS("opendxp.element.workflows");
/**
 * @private
 */
opendxp.element.workflows = Class.create({

    initialize: function(element, type) {
        this.element = element;
        this.type = type;
    },

    getLayout: function () {

        if (this.layout == null) {

            this.store = opendxp.helpers.grid.buildDefaultStore(
                Routing.generate('opendxp_admin_workflow_getworkflowdetailsstore', {ctype: this.type, cid: this.element.id}),
                ['workflowName','placeInfo','graph'],
                0, //no paging needed
                {autoLoad: false}
            );


            var columns = [
                {text: t("workflow"), sortable: false, dataIndex: 'workflowName', flex: 20},
                {text: t("workflow_current_state"), sortable: false, dataIndex: 'placeInfo', flex: 30},
                {text: t("workflow_graph"), sortable: false, dataIndex: 'graph', flex: 90},
            ];


            this.grid = new Ext.grid.GridPanel({
                store: this.store,
                region: "center",
                columns: columns,
                columnLines: true,
                autoExpandColumn: "description",
                stripeRows: true,
                autoScroll: true,
                viewConfig: {
                    forceFit: true
                }
            });


            this.layout = new Ext.Panel( {
                tabConfig: {
                    tooltip: t('workflow_details')
                },
                items: [this.grid],
                iconCls: "opendxp_material_icon_workflow opendxp_material_icon",
                layout: 'border'
            });

            this.layout.on("activate", function () {
                this.store.load();
            }.bind(this));
        }

        return this.layout;
    }

});
