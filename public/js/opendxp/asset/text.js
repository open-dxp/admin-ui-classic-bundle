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

opendxp.registerNS("opendxp.asset.text");
/**
 * @private
 */
opendxp.asset.text = Class.create(opendxp.asset.asset, {

    initialize: function(id, options) {

        this.options = options;
        this.id = intval(id);
        this.setType("text");
        this.addLoadingPanel();

        const preOpenAssetText = new CustomEvent(opendxp.events.preOpenAsset, {
            detail: {
                object: this,
                type: "text"
            },
            cancelable: true
        });

        const isAllowed = document.dispatchEvent(preOpenAssetText);
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

        items.push(this.getEditPanel());

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
    },

    getEditPanel: function () {

        if (!this.editPanel) {
            if(this.data.data !== false) {
                let editorId = "asset_editor_" + this.id;

                this.editPanel = new Ext.Panel({
                    title: t("edit"),
                    iconCls: "opendxp_icon_edit",
                    bodyStyle: "padding: 10px;",
                    layout: 'fit',
                    items: [{
                        xtype: 'component',
                        html: '<div id="' + editorId + '" style="height:100%;width:100%"></div>',
                        listeners: {
                            afterrender: function (cmp) {
                                var me = this;
                                var editor = ace.edit(editorId);
                                editor.setTheme('ace/theme/chrome');

                                //set editor file mode
                                let modelist = ace.require('ace/ext/modelist');
                                let mode = modelist.getModeForPath(this.data.url).mode;
                                editor.getSession().setMode(mode);

                                //set data
                                if (this.data.data) {
                                    editor.setValue(this.data.data);
                                    editor.clearSelection();
                                }

                                editor.setOptions({
                                    showLineNumbers: true,
                                    showPrintMargin: false,
                                    fontFamily: 'Courier New, Courier, monospace;'
                                });

                                editor.on("change", function(obj) {
                                    me.detectedChange();
                                });

                                this.editor = editor;
                            }.bind(this)
                        }
                    }]
                });


                this.editPanel.on("resize", function (el, width, height, rWidth, rHeight) {
                    this.editor.resize();
                }.bind(this));

                this.editPanel.on("destroy", function (el) {
                    if (this.editor) {
                        this.editor.destroy();
                    }
                }.bind(this));
            } else {
                this.editPanel = new Ext.Panel({
                    title: t("preview"),
                    html: t("preview_not_available"),
                    bodyCls: "opendxp_panel_body_centered",
                    iconCls: "opendxp_material_icon_devices opendxp_material_icon"
                });
            }
        }

        return this.editPanel;
    },
    
    
    getSaveData : function ($super, only) {
        var parameters = $super(only);
        
        if(!Ext.isString(only) && this.data.data !== false) {
            parameters.data = this.editor.getValue();
        }
        
        return parameters;
    }
});

