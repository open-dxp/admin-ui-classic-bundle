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

opendxp.registerNS("opendxp.asset.unknown");
/**
 * @private
 */
opendxp.asset.unknown = Class.create(opendxp.asset.asset, {

    initialize: function(id, options) {

        this.options = options;
        this.id = intval(id);
        this.setType("unknown");
        this.addLoadingPanel();

        const preOpenAssetUnknown = new CustomEvent(opendxp.events.preOpenAsset, {
            detail: {
                object: this,
                type: "unknown"
            },
            cancelable: true
        });

        const isAllowed = document.dispatchEvent(preOpenAssetUnknown);
        if (!isAllowed) {
            this.removeLoadingPanel();
            return;
        }


        var user = opendxp.globalmanager.get("user");

        this.properties = new opendxp.element.properties(this, "asset");
        this.versions = new opendxp.asset.versions(this);
        this.scheduler = new opendxp.element.scheduler(this, "asset");

        if (opendxp.settings.dependency) {
            this.dependencies = new opendxp.element.dependencies(this, "asset");
        }

        if (user.isAllowed("notes_events")) {
            this.notes = new opendxp.element.notes(this, "asset");
        }

        this.tagAssignment = new opendxp.element.tag.assignment(this, "asset");
        this.metadata = new opendxp.asset.metadata.editor(this);
        this.workflows = new opendxp.element.workflows(this, "asset");

        this.getData();
    },

    getTabPanel: function () {
        var items = [];
        var user = opendxp.globalmanager.get("user");

        if (this.isAllowed("view") || this.isAllowed("publish")) {
            items.push(this.metadata.getLayout());
        }
        if (this.isAllowed("properties")) {
            items.push(this.properties.getLayout());
        }
        if (this.isAllowed("versions")) {
            items.push(this.versions.getLayout());
        }
        if (this.isAllowed("settings")) {
            items.push(this.scheduler.getLayout());
        }

        if (typeof this.dependencies !== "undefined") {
            items.push(this.dependencies.getLayout());
        }

        if (user.isAllowed("notes_events")) {
            items.push(this.notes.getLayout());
        }

        if (user.isAllowed("tags_assignment")) {
            items.push(this.tagAssignment.getLayout());
        }

        if (user.isAllowed("workflow_details") && this.data.workflowManagement && this.data.workflowManagement.hasWorkflowManagement === true) {
            items.push(this.workflows.getLayout());
        }

        this.tabbar = opendxp.helpers.getTabBar({items: items});
        return this.tabbar;
    }
});
