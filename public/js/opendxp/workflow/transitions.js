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

opendxp.registerNS("opendxp.workflow.transitions.x");

/**
 * @private
 */
opendxp.workflow.transitions.perform = function (ctype, cid, elementEditor, workflow, transition) {


    Ext.Ajax.request({
        url : transition.isGlobalAction ? Routing.generate('opendxp_admin_workflow_submitglobal') : Routing.generate('opendxp_admin_workflow_submitworkflowtransition'),
        method: 'post',
        params: {
            ctype: ctype,
            cid: cid,
            workflowName: workflow,
            transition: transition.name
        },
        success: function(response) {
            var data = Ext.decode(response.responseText);

            if (data.success) {

                opendxp.helpers.showNotification(t("workflow_transition_applied_successfully"), t(transition.label), "success");

                elementEditor.reload({layoutId: transition.objectLayout});

            } else {
                Ext.MessageBox.alert(t(data.message), data.reasons.map(function(reason){ return t(reason); }).join('<br>'));
            }


        },
    });
};
