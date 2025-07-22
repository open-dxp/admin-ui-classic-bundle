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

opendxp.registerNS("opendxp.document.snippet");
/**
 * @private
 */
opendxp.document.snippet = Class.create(opendxp.document.page_snippet, {

    initialize: function(id, options) {

        this.options = options;
        this.id = intval(id);
        this.setType("snippet");
        this.addLoadingPanel();

        const preOpenDocumentSnippet = new CustomEvent(opendxp.events.preOpenDocument, {
            detail: {
                document: this,
                type: "snippet"
            },
            cancelable: true
        });

        const isAllowed = document.dispatchEvent(preOpenDocumentSnippet);
        if (!isAllowed) {
            this.removeLoadingPanel();
            return;
        }

        this.getData();
    },

    init: function () {

        var user = opendxp.globalmanager.get("user");

        this.edit = new opendxp.document.edit(this);

        if (this.isAllowed("settings")) {
            this.settings = new opendxp.document.snippets.settings(this);
            this.scheduler = new opendxp.element.scheduler(this, "document");
        }

        if (user.isAllowed("notes_events")) {
            this.notes = new opendxp.element.notes(this, "document");
        }

        if (this.isAllowed("properties")) {
            this.properties = new opendxp.document.properties(this, "document");
        }
        if (this.isAllowed("versions")) {
            this.versions = new opendxp.document.versions(this);
        }

        if (opendxp.settings.dependency) {
            this.dependencies = new opendxp.element.dependencies(this, "document");
        }

        if(opendxp.globalmanager.get('customReportsPanelImplementationFactory').hasImplementation()) {
            this.reports = opendxp.globalmanager.get('customReportsPanelImplementationFactory').getNewReportInstance("document_snippet");
        }
        this.tagAssignment = new opendxp.element.tag.assignment(this, "document");
        this.workflows = new opendxp.element.workflows(this, "document");
    },


    getTabPanel: function () {

        var items = [];
        var user = opendxp.globalmanager.get("user");

        items.push(this.edit.getLayout());

        if (this.isAllowed("settings")) {
            items.push(this.settings.getLayout());
        }
        if (this.isAllowed("properties") && this.properties) {
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

        if(this.reports) {
            var reportLayout = this.reports.getLayout();
            if (reportLayout) {
                items.push(reportLayout);
            }
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
    },

    getSaveData : function (only) {

        var parameters = {};
        parameters.id = this.id;

        // get only scheduled tasks
        if (only == "scheduler") {
            try {
                parameters.scheduler = Ext.encode(this.scheduler.getValues());
                return parameters;
            }
            catch (e) {
                console.log("scheduler not available");
                return;
            }
        }


        // save all data allowed
        if (this.isAllowed("properties")) {
            // properties
            try {
                parameters.properties = Ext.encode(this.properties.getValues());
            }
            catch (e2) {
                //console.log(e2);
            }
        }

        if (this.isAllowed("settings")) {
            // settings
            try {
                parameters.settings = Ext.encode(this.settings.getValues());
            }
            catch (e3) {
                //console.log(e3);
            }

            // scheduler
            try {
                parameters.scheduler = Ext.encode(this.scheduler.getValues());
            }
            catch (e4) {
                //console.log(e4);
            }
        }

        // data
        try {
            parameters.data = Ext.encode(this.edit.getValues());
            if(this.edit.areaToolBar && this.edit.areaToolBar.targetGroup && this.edit.areaToolBar.targetGroup.getValue()) {
                parameters.appendEditables = "true";
            }
        }
        catch (e5) {
            //console.log(e5);
        }

        return parameters;
    }

});

