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

opendxp.registerNS("opendxp.object.folder");
/**
 * @private
 */
opendxp.object.folder = Class.create(opendxp.object.abstract, {

    type: "folder",

    initialize: function(id, options) {

        this.options = options;
        this.id = intval(id);
        this.addLoadingPanel();

        const preOpenObjectFolder = new CustomEvent(opendxp.events.preOpenObject, {
            detail: {
                object: this,
                type: "folder"
            },
            cancelable: true
        });

        const isAllowed = document.dispatchEvent(preOpenObjectFolder);
        if (!isAllowed) {
            this.removeLoadingPanel();
            return;
        }

        this.getData();
    },

    init: function () {

        var user = opendxp.globalmanager.get("user");

        this.search = new opendxp.object.search(this, "folder");

        if (this.isAllowed("properties")) {
            this.properties = new opendxp.element.properties(this, "object");
        }

        if (user.isAllowed("notes_events")) {
            this.notes = new opendxp.element.notes(this, "object");
        }

        if (opendxp.settings.dependency) {
            this.dependencies = new opendxp.element.dependencies(this, "object");
        }

        this.tagAssignment = new opendxp.element.tag.assignment(this, "object");
        this.workflows = new opendxp.element.workflows(this, "object");
    },


    getData: function () {

        var eventData =  {requestParams: {id: this.id}};
        const preGetObjectFolder = new CustomEvent(opendxp.events.preGetObjectFolder, {
            detail: {
                eventData: eventData,
            },
            cancelable: true
        });

        const isAllowed = document.dispatchEvent(preGetObjectFolder);
        if (!isAllowed) {
            this.removeLoadingPanel();
            return;
        }

        var options = this.options || {};
        Ext.Ajax.request({
            url: Routing.generate('opendxp_admin_dataobject_dataobject_getfolder'),
            params: eventData.requestParams,
            ignoreErrors: options.ignoreNotFoundError,
            success: this.getDataComplete.bind(this),
            failure: function() {
                this.forgetOpenTab();
            }.bind(this)
        });
    },

    forgetOpenTab: function() {
        opendxp.globalmanager.remove("object_" + this.id);
        opendxp.helpers.forgetOpenTab("object_" + this.id + "_folder");
    },

    getDataComplete: function (response) {
        try {
            this.data = Ext.decode(response.responseText);

            if (typeof this.data.editlock == "object") {
                opendxp.helpers.lockManager(this.id, "object", "folder", this.data);
                throw "object is locked";
            }

            this.init();
            this.addTab();
            this.startChangeDetector();
        }
        catch (e) {
            console.log(e);
            opendxp.helpers.closeObject(this.id);
        }
    },


    addTab: function () {

        var tabTitle = this.data.general.key;
        if (this.id == 1) {
            tabTitle = "home";
        }

        this.tabPanel = Ext.getCmp("opendxp_panel_tabs");
        var tabId = "object_" + this.id;

        const tabbarContainer = new Ext.Container({
            flex: 2
        });

        const tabPanel = this.getTabPanel();
        const toolbar = this.getLayoutToolbar();

        if (opendxp.helpers.checkIfNewHeadbarLayoutIsEnabled()) {
            this.tab = new Ext.Panel({
                id: tabId,
                cls: "opendxp_panel_toolbar_horizontal_border_layout",
                title: htmlspecialchars(tabTitle),
                closable:true,
                hideMode: "offsets",
                layout: "border",
                items: [
                    {
                        xtype: 'panel',
                        width: "100%",
                        region: 'north',
                        layout: 'hbox',
                        items: [
                            toolbar,
                            tabbarContainer,
                        ]
                    },

                    tabPanel
                ],
                iconCls: "opendxp_icon_folder",
                object: this
            });

            tabPanel.items.each((item) => {
                const title = item.getTitle();

                if (title) {
                    item.tab.setTooltip(item.getTitle());
                    item.setTitle('');
                }
            });

            tabbarContainer.add(tabPanel.getTabBar());

            tabPanel.getTabBar().on('add', () => {
                setTimeout(() => {
                    this.handleTabbarLayoutOnSmallDevices(tabPanel, tabbarContainer);
                }, 100);
            });

            tabbarContainer.on('resize', () => {
                this.handleTabbarLayoutOnSmallDevices(tabPanel, tabbarContainer);
            });
        } else {
            this.tab = new Ext.Panel({
                id: tabId,
                title: htmlspecialchars(tabTitle),
                closable:true,
                layout: "border",
                items: [
                    toolbar,
                    tabPanel
                ],
                iconCls: "opendxp_icon_folder",
                object: this
            });
        }

        this.tab.on("beforedestroy", function () {
            Ext.Ajax.request({
                url: Routing.generate('opendxp_admin_element_unlockelement'),
                method: 'PUT',
                params: {
                    id: this.id,
                    type: "object"
                }
            });
        }.bind(this));

        // remove this instance when the panel is closed
        this.tab.on("destroy", function () {
            opendxp.globalmanager.remove("object_" + this.id);
            opendxp.helpers.forgetOpenTab("object_" + this.id + "_folder");

        }.bind(this));

        this.tab.on("activate", function () {
            this.tab.updateLayout();
            opendxp.layout.refresh();
        }.bind(this));

        this.tab.on("afterrender", function (tabId) {
            this.tabPanel.setActiveItem(tabId);

            const postOpenObject = new CustomEvent(opendxp.events.postOpenObject, {
                detail: {
                    object: this,
                    type: "folder"
                }
            });

            document.dispatchEvent(postOpenObject);


            // load selected class if available
            if(this.data["selectedClass"]) {
                this.search.setClass(this.data["selectedClass"]);
            }

        }.bind(this, tabId));

        this.removeLoadingPanel();

        this.addToMainTabPanel();

        if (this.getAddToHistory()) {
            opendxp.helpers.recordElement(this.id, "object", this.data.general.path + this.data.general.key);
        }

        // recalculate the layout
        opendxp.layout.refresh();
    },

    handleTabbarLayoutOnSmallDevices: function(tabPanel, tabbarContainer) {
        const tabbarItems = tabPanel.getTabBar().items.items;
        const firstTab = tabbarItems[0].getEl()?.dom;
        const lastTab = tabbarItems[tabbarItems.length - 1].getEl()?.dom;

        if (!firstTab || !lastTab) return;

        const firstBoundingRect = firstTab.getBoundingClientRect();
        const lastBoundingRect = lastTab.getBoundingClientRect();
        const firstAndLastTabDistance = lastBoundingRect.x + lastBoundingRect.width - firstBoundingRect.x;

        if (firstAndLastTabDistance > tabbarContainer.getWidth()) {
            tabPanel.getTabBar().setLayout({
                pack: 'start'
            })
        } else {
            tabPanel.getTabBar().setLayout({
                pack: 'end'
            })
        }

        this.tab.updateLayout();
    },

    activate: function () {
        var tabId = "object_" + this.id;
        var tabPanel = Ext.getCmp("opendxp_panel_tabs");
        tabPanel.setActiveItem(tabId);
    },

    getLayoutToolbar : function () {

        if (!this.toolbar) {

            this.toolbarButtons = {};

            this.toolbarButtons.publish = new Ext.Button({
                text: t('save'),
                iconCls: "opendxp_icon_save_white",
                cls: "opendxp_save_button",
                scale: "medium",
                handler: this.save.bind(this, "publish")
            });

            this.toolbarButtons.remove = new Ext.Button({
                tooltip: t('delete'),
                iconCls: "opendxp_material_icon_delete opendxp_material_icon",
                scale: "medium",
                handler: function () {
                    var options = this.search.onRawDeleteSelectedRows();
                    if (!options) {
                        options = {
                            "elementType" : "object",
                            "id": this.id
                        };
                    }
                    opendxp.elementservice.deleteElement(options);
                }.bind(this)
            });

            this.toolbarButtons.rename = new Ext.Button({
                tooltip: t('rename'),
                iconCls: "opendxp_material_icon_rename opendxp_material_icon",
                scale: "medium",
                handler: this.rename.bind(this)
            });

            var buttons = [];

            if (this.isAllowed("publish")) {
                buttons.push(this.toolbarButtons.publish);
            }

            buttons.push("-");

            if (opendxp.helpers.checkIfNewHeadbarLayoutIsEnabled()) {
                this.toolbarSubmenu = new Ext.Button({
                    ...opendxp.helpers.headbar.getSubmenuConfig()
                });

                buttons.push(this.toolbarSubmenu);
            }

            if(this.isAllowed("delete") && !this.data.general.locked && this.data.general.id != 1) {
                if (opendxp.helpers.checkIfNewHeadbarLayoutIsEnabled()) {
                    this.toolbarSubmenu.menu.add({
                        text: t('delete'),
                        iconCls: "opendxp_material_icon_delete opendxp_material_icon",
                        scale: "medium",
                        handler: function () {
                            var options = this.search.onRawDeleteSelectedRows();
                            if (!options) {
                                options = {
                                    "elementType" : "object",
                                    "id": this.id
                                };
                            }
                            opendxp.elementservice.deleteElement(options);
                        }.bind(this)
                    });
                } else {
                    buttons.push(this.toolbarButtons.remove);
                }
            }

            if(this.isAllowed("rename") && !this.data.general.locked && this.data.general.id != 1) {
                if(this.isAllowed("rename") && !this.data.locked) {
                    if (opendxp.helpers.checkIfNewHeadbarLayoutIsEnabled()) {
                        this.toolbarSubmenu.menu.add({
                            text: t('rename'),
                            iconCls: "opendxp_material_icon_rename opendxp_material_icon",
                            scale: "medium",
                            handler: this.rename.bind(this)
                        });
                    } else {
                        buttons.push(this.toolbarButtons.rename);
                    }
                }
            }

            buttons.push({
                tooltip: t('reload'),
                iconCls: "opendxp_material_icon_reload opendxp_material_icon",
                scale: "medium",
                handler: this.reload.bind(this)
            });

            if (opendxp.elementservice.showLocateInTreeButton("object")) {
                buttons.push({
                    tooltip: t('show_in_tree'),
                    iconCls: "opendxp_material_icon_locate opendxp_material_icon",
                    scale: "medium",
                    handler: this.selectInTree.bind(this, "folder")
                });
            }

            buttons.push({
                xtype: "splitbutton",
                tooltip: t("show_metainfo"),
                iconCls: "opendxp_material_icon_info opendxp_material_icon",
                scale: "medium",
                handler: this.showMetaInfo.bind(this),
                menu: this.getMetaInfoMenuItems()
            });

            const searchAndMoveConfig = {
                ...(() => opendxp.helpers.checkIfNewHeadbarLayoutIsEnabled() ? { text: t('search_and_move') } : { tooltip: t('search_and_move') })(),
                iconCls: "opendxp_material_icon_download_zip opendxp_material_icon",
                scale: "medium",
                handler: opendxp.helpers.searchAndMove.bind(this, this.data.general.id,
                    function () {
                        if (this.search.grid) {
                            this.search.grid.getStore().reload();
                        } else {
                            this.reload();
                        }
                        //refresh complete object tree as moved object(s) source is unknown
                        opendxp.elementservice.refreshRootNodeAllTrees("object");
                    }.bind(this), "object")
            }

            if (opendxp.helpers.checkIfNewHeadbarLayoutIsEnabled()) {
                this.toolbarSubmenu.menu.add(searchAndMoveConfig);
            } else {
                buttons.push(searchAndMoveConfig);
            }

            if (!opendxp.helpers.checkIfNewHeadbarLayoutIsEnabled()) {
                buttons.push("-");
                buttons.push({
                    xtype: 'tbtext',
                    text: t("id") + " " + this.data.general.id,
                    scale: "medium"
                });
            }

            //workflow management
            opendxp.elementservice.integrateWorkflowManagement('object', this.id, this, buttons);

            this.toolbar = new Ext.Toolbar({
                id: "object_toolbar_" + this.id,
                region: "north",
                border: false,
                ...(() => opendxp.helpers.checkIfNewHeadbarLayoutIsEnabled() ? { flex: 3 } : { })(),
                cls: "opendxp_main_toolbar",
                items: buttons,
                overflowHandler: 'scroller'
            });
        }

        return this.toolbar;
    },

    getTabPanel: function () {

        var items = [];
        var user = opendxp.globalmanager.get("user");

        var search = this.search.getLayout();
        if (search) {
            items.push(search);
        }
        if (this.isAllowed("properties")) {
            items.push(this.properties.getLayout());
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

    getSaveData: function () {
        var data = {};

        data.id = this.id;

        // properties
        try {
            data.properties = Ext.encode(this.properties.getValues());
        }
        catch (e1) {
            //console.log(e1);
        }


        try {
            data.general = Ext.apply({}, this.data.general);
            // object shouldn't be relocated, renamed, or anything else that is evil
            delete data.general["parentId"];
            delete data.general["type"];
            delete data.general["key"];
            delete data.general["locked"];

            data.general = Ext.encode(data.general);
        }
        catch (e2) {
            //console.log(e2);
        }
        return data;
    },

    save : function (task) {

        if(this.tab.disabled || this.tab.isMasked()) {
            return;
        }

        this.tab.mask();


        const preSaveObject = new CustomEvent(opendxp.events.preSaveObject, {
            detail: {
                object: this,
                type: "object"
            },
            cancelable: true
        });

        const isAllowed = document.dispatchEvent(preSaveObject);
        if (!isAllowed) {
            this.tab.unmask();
            return false;
        }

        Ext.Ajax.request({
            url: Routing.generate('opendxp_admin_dataobject_dataobject_savefolder', {task: task}),
            method: "PUT",
            params: this.getSaveData(),
            success: function (response) {
                try{
                    var rdata = Ext.decode(response.responseText);
                    if (rdata && rdata.success) {
                        opendxp.helpers.showNotification(t("success"), t("saved_successfully"), "success");
                        this.resetChanges();

                        const postSaveObject = new CustomEvent(opendxp.events.postSaveObject, {
                            detail: {
                                object: this,
                            }
                        });

                        document.dispatchEvent(postSaveObject);

                    }
                    else {
                        opendxp.helpers.showNotification(t("error"), t("saving_failed"),
                            "error",t(rdata.message));
                    }
                } catch(e){
                    opendxp.helpers.showNotification(t("error"), t("saving_failed"), "error");
                }

                this.tab.unmask();
            }.bind(this),
            failure: function () {
                this.tab.unmask();
            }
        });

    },


    remove: function () {
        var options = {
            "elementType" : "object",
            "id": this.id
        };
        opendxp.elementservice.deleteElement(options);
    },

    isAllowed : function (key) {
        return this.data.userPermissions[key];
    },

    reload: function () {
        this.tab.on("close", function() {
            var currentTabIndex = this.tab.ownerCt.items.indexOf(this.tab);
            window.setTimeout(function (id) {
                opendxp.helpers.openObject(id, "folder", {tabIndex: currentTabIndex});
            }.bind(window, this.id), 500);
        }.bind(this));

        opendxp.helpers.closeObject(this.id);
    },

    getMetaInfo: function() {
        return {
            id: this.data.general.id,
            path: this.data.general.fullpath,
            modificationdate: this.data.general.modificationDate,
            creationdate: this.data.general.creationDate,
            usermodification: this.data.general.userModification,
            usermodification_name: this.data.general.userModificationFullname,
            userowner: this.data.general.userOwner,
            userowner_name: this.data.general.userOwnerFullname,
            deeplink: opendxp.helpers.getDeeplink("object", this.data.general.id, "folder")
        };
    },

    showMetaInfo: function() {
        var metainfo = this.getMetaInfo();

        new opendxp.element.metainfo([
        {
            name: "id",
            value: metainfo.id
        },
        {
            name: "path",
            value: metainfo.path
        }, {
            name: "modificationdate",
            type: "date",
            value: metainfo.modificationdate
        }, {
            name: "creationdate",
            type: "date",
            value: metainfo.creationdate
        }, {
            name: "usermodification",
            type: "user",
            value: '<span data-uid="' + metainfo.usermodification + '">' + metainfo.usermodification_name + '</span>'
        }, {
            name: "userowner",
            type: "user",
            value: '<span data-uid="' + metainfo.userowner + '">' + metainfo.userowner_name + '</span>'
    }, {
        name: "deeplink",
            value: metainfo.deeplink
        }
        ], "folder");
    },

    rename: function () {
        if(this.isAllowed("rename") && !this.data.general.locked && this.data.general.id != 1) {
            var options = {
                elementType: "object",
                elementSubType: this.data.general.type,
                id: this.id,
                default: this.data.general.key
            }
            opendxp.elementservice.editElementKey(options);
        }
    }

});
