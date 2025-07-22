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

opendxp.registerNS("opendxp.asset.asset");
/**
 * @private
 */
opendxp.asset.asset = Class.create(opendxp.element.abstract, {
    willClose: false,
    getData: function () {
        Ext.Ajax.request({
            url: Routing.generate('opendxp_admin_asset_getdatabyid'),
            success: this.getDataComplete.bind(this),
            failure: function() {
                this.forgetOpenTab();
            }.bind(this),
            params: {
                id: this.id,
                    type: this.type
            }
        });
    },

    getDataComplete: function (response) {
        try {
            this.data = Ext.decode(response.responseText);

            if (this.data.success === false && this.options && this.options.ignoreNotFoundError) {
                return;
            }

            if (typeof this.data.editlock == "object") {
                opendxp.helpers.lockManager(this.id, "asset", this.type, this.data);
                throw "asset is locked";
            }

            if (this.type !== this.data.type) {
                Ext.MessageBox.alert(t("warning"), t("asset_type_changed"));
            }

            this.addTab();
            this.startChangeDetector();
        }
        catch (e) {
            console.log(e);
            opendxp.helpers.closeAsset(this.id);
        }
    },

    selectInTree: function (button) {
        try {
            opendxp.treenodelocator.showInTree(this.id, "asset", button)
        } catch (e) {
            console.log(e);
        }
    },

    addTab: function () {
        var tabTitle = this.data.filename;
        
        if (this.id == 1) {
            tabTitle = "home";
        }

        this.tabPanel = Ext.getCmp("opendxp_panel_tabs");
        var tabId = "asset_" + this.id;

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
                iconCls: this.getIconClass(),
                asset: this,
            });

            this.toolbarSubmenu.menu.addCls('opendxp_headbar_submenu_menu');

            opendxp.helpers.headbar.prepareTabPanel(tabPanel, tabbarContainer, this.tab);
        } else {
            this.tab = new Ext.Panel({
                id: tabId,
                title: htmlspecialchars(tabTitle),
                closable:true,
                layout: "border",
                items: [toolbar, tabPanel],
                asset: this,
                iconCls: this.getIconClass()
            });
        }

        this.tab.on("activate", function () {
            this.tab.updateLayout();
            opendxp.layout.refresh();
        }.bind(this));


        this.tab.on("beforedestroy", function () {
            Ext.Ajax.request({
                url: Routing.generate('opendxp_admin_element_unlockelement'),
                method: 'PUT',
                params: {
                    id: this.data.id,
                    type: "asset"
                }
            });
        }.bind(this));

        // remove this instance when the panel is closed
        this.tab.on("destroy", function () {
            this.forgetOpenTab();

        }.bind(this));

        this.tab.on("afterrender", function (tabId) {
            this.tabPanel.setActiveItem(tabId);

            const postOpenAsset = new CustomEvent(opendxp.events.postOpenAsset, {
                detail: {
                    asset: this,
                    type: this.getType()
                }
            });

            document.dispatchEvent(postOpenAsset);
        }.bind(this, tabId));

        this.removeLoadingPanel();

        this.addToMainTabPanel();

        if (this.getAddToHistory()) {
            opendxp.helpers.recordElement(this.id, "asset", this.data.path + this.data.filename);
        }

        // recalculate the layout
        opendxp.layout.refresh();
    },

    forgetOpenTab: function() {
        opendxp.globalmanager.remove("asset_" + this.id);
        opendxp.helpers.forgetOpenTab("asset_" + this.id + "_" + this.getType());
    },

    getLayoutToolbar : function () {

        if (!this.toolbar) {

            var buttons = [];

            this.toolbarButtons = {};


            if (this.isAllowed("publish")) {

                this.toolbarButtons.publish = Ext.create("Ext.button.Split", {
                    text: t("save_and_publish"),
                    iconCls: "opendxp_icon_save_white",
                    cls: "opendxp_save_button",
                    scale: "medium",
                    handler: this.save.bind(this),
                    menu: [{
                        text: t('save_pubish_close'),
                        iconCls: "opendxp_icon_save",
                        handler: this.saveClose.bind(this)
                    },{
                        text: t('save_only_scheduled_tasks'),
                        iconCls: "opendxp_icon_save",
                        handler: this.save.bind(this, "scheduler"),
                        hidden: !this.isAllowed("settings")
                    }
                    ]
                });


                buttons.push(this.toolbarButtons.publish);
            }

            buttons.push("-");

            if (opendxp.helpers.checkIfNewHeadbarLayoutIsEnabled()) {
                this.toolbarSubmenu = new Ext.Button({
                    ...opendxp.helpers.headbar.getSubmenuConfig()
                });

                buttons.push(this.toolbarSubmenu);
            }

            if (this.isAllowed("delete") && !this.data.locked) {
                const deleteConfig = {
                    ...(() => opendxp.helpers.checkIfNewHeadbarLayoutIsEnabled() ? { text: t('delete') } : { tooltip: t('delete') })(),
                    iconCls: "opendxp_material_icon_delete opendxp_material_icon",
                    scale: "medium",
                    handler: this.remove.bind(this)
                };

                if (opendxp.helpers.checkIfNewHeadbarLayoutIsEnabled()) {
                    this.toolbarSubmenu.menu.add(deleteConfig);
                } else {
                    this.toolbarButtons.remove = new Ext.Button(deleteConfig);
                    buttons.push(this.toolbarButtons.remove);
                }
            }

            if (this.isAllowed("rename") && !this.data.locked) {
                const renameConfig = {
                    ...(() => opendxp.helpers.checkIfNewHeadbarLayoutIsEnabled() ? { text: t('rename') } : { tooltip: t('rename') })(),
                    iconCls: "opendxp_material_icon_rename opendxp_material_icon",
                    scale: "medium",
                    handler: this.rename.bind(this)
                };

                if (opendxp.helpers.checkIfNewHeadbarLayoutIsEnabled()) {
                    this.toolbarSubmenu.menu.add(renameConfig);
                } else {
                    this.toolbarButtons.rename = new Ext.Button(renameConfig);
                    buttons.push(this.toolbarButtons.rename);
                }
            }

            if (this.isAllowed("publish")) {
                const uploadConfig = {
                    ...(() => opendxp.helpers.checkIfNewHeadbarLayoutIsEnabled() ? { text: t('upload_new_version') } : { tooltip: t('upload_new_version') })(),
                    iconCls: "opendxp_material_icon_upload opendxp_material_icon",
                    scale: "medium",
                    handler: function () {
                        opendxp.elementservice.replaceAsset(this.data.id, function () {
                            this.reload();
                        }.bind(this));
                    }.bind(this)
                };

                if (opendxp.helpers.checkIfNewHeadbarLayoutIsEnabled()) {
                    this.toolbarSubmenu.menu.add(uploadConfig);
                } else {
                    this.toolbarButtons.upload = new Ext.Button(uploadConfig);
                    buttons.push(this.toolbarButtons.upload);
                }
            }

            const downloadConfig = {
                ...(() => opendxp.helpers.checkIfNewHeadbarLayoutIsEnabled() ? { text: t('download') } : { tooltip: t('download') })(),
                iconCls: "opendxp_material_icon_download opendxp_material_icon",
                scale: "medium",
                handler: function () {
                    opendxp.helpers.download(Routing.generate('opendxp_admin_asset_download', {id: this.data.id}));
                }.bind(this)
            };

            if (opendxp.helpers.checkIfNewHeadbarLayoutIsEnabled()) {
                this.toolbarSubmenu.menu.add(downloadConfig);
            } else {
                buttons.push(downloadConfig);
            }

            buttons.push({
                tooltip: t('reload'),
                iconCls: "opendxp_material_icon_reload opendxp_material_icon",
                scale: "medium",
                handler: this.reload.bind(this)
            });

            if (opendxp.elementservice.showLocateInTreeButton("asset")) {
                buttons.push({
                    tooltip: t('show_in_tree'),
                    iconCls: "opendxp_material_icon_locate opendxp_material_icon",
                    scale: "medium",
                    handler: this.selectInTree.bind(this)
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

            // only for videos and images
            if (this.isAllowed("publish") && in_array(this.data.type,["image","video"]) || this.data.mimetype == "application/pdf") {
                const clearThumbnailsConfig = {
                    ...(() => opendxp.helpers.checkIfNewHeadbarLayoutIsEnabled() ? { text: t('clear_thumbnails') } : { tooltip: t('clear_thumbnails') })(),
                    iconCls: "opendxp_material_icon_clear_thumbnails opendxp_material_icon",
                    scale: "medium",
                    handler: function () {
                        Ext.Ajax.request({
                            url: Routing.generate('opendxp_admin_asset_clearthumbnail'),
                            method: 'POST',
                            params: {
                                id: this.data.id
                            }
                        });
                    }.bind(this)
                };

                if (opendxp.helpers.checkIfNewHeadbarLayoutIsEnabled()) {
                    this.toolbarSubmenu.menu.add(clearThumbnailsConfig);
                } else {
                    buttons.push(clearThumbnailsConfig);
                }
            }

            if (opendxp.globalmanager.get("user").isAllowed('notifications_send')) {
                const notificationConfig = {
                    ...(() => opendxp.helpers.checkIfNewHeadbarLayoutIsEnabled() ? { text: t('share_via_notifications') } : { tooltip: t('share_via_notifications') })(),
                    iconCls: "opendxp_icon_share",
                    scale: "medium",
                    handler: this.shareViaNotifications.bind(this)
                };

                if (opendxp.helpers.checkIfNewHeadbarLayoutIsEnabled()) {
                    this.toolbarSubmenu.menu.add(notificationConfig);
                } else {
                    buttons.push(notificationConfig);
                }
            }

            if (!opendxp.helpers.checkIfNewHeadbarLayoutIsEnabled()) {
                buttons.push("-");
                buttons.push({
                    xtype: 'tbtext',
                    text: t("id") + " " + this.data.id,
                    scale: "medium"
                });
            }

            //workflow management
            opendxp.elementservice.integrateWorkflowManagement('asset', this.data.id, this, buttons);

            this.toolbar = new Ext.Toolbar({
                id: "asset_toolbar_" + this.id,
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

    activate: function () {
        var tabId = "asset_" + this.id;
        var tabPanel = Ext.getCmp("opendxp_panel_tabs");
        tabPanel.setActiveItem(tabId);
    },

    saveToSession: function (onCompleteCallback) {

        if (typeof onCompleteCallback != "function") {
            onCompleteCallback = function () {
            };
        }

        this.save(false, onCompleteCallback, "session")
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


        // meta-data
        try {
            parameters.metadata = Ext.encode(this.metadata.getValues());
        }
        catch (e2) {
            // console.log(e2);
        }

        // properties
        try {
            parameters.properties = Ext.encode(this.properties.getValues());
        }
        catch (e3) {
            //console.log(e3);
        }

        // scheduler
        try {
            if (this.scheduler) {
                parameters.scheduler = Ext.encode(this.scheduler.getValues());
            }
        }
        catch (e4) {
            //console.log(e4);
        }

        return parameters;
    },

    save : function (only, callback, task) {

        if(this.tab.disabled || this.tab.isMasked()) {
            return;
        }

        this.tab.mask();
        this.saving = true;

        const preSaveAsset = new CustomEvent(opendxp.events.preSaveAsset, {
            detail: {
                id: this.id,
                task: task
            },
            cancelable: true
        });

        const isAllowed = document.dispatchEvent(preSaveAsset);
        if (!isAllowed) {
            this.tab.unmask();
            this.saving = false;
            return false;
        }


        let params = this.getSaveData(only);
        if (task) {
            if(!params) {
                this.tab.unmask();
                return;
            }

            params.task = task;
        }

        Ext.Ajax.request({
            url: Routing.generate('opendxp_admin_asset_save'),
            method: "PUT",
            success: function (response) {
                try{
                    var rdata = Ext.decode(response.responseText);
                    if (rdata && rdata.success) {
                        opendxp.helpers.showNotification(t("save"), t("saved_successfully"), "success");
                        this.resetChanges();
                        Ext.apply(this.data, rdata.data);

                        const postSaveAsset = new CustomEvent(opendxp.events.postSaveAsset, {
                            detail: {
                                id: this.id
                            }
                        });

                        document.dispatchEvent(postSaveAsset);

                        opendxp.helpers.updateTreeElementStyle('asset', this.id, rdata.treeData);

                    }
                } catch(e){
                    opendxp.helpers.showNotification(t("error"), t("saving_failed"), "error");
                }
                // reload versions
                if (this.isAllowed("versions")) {
                    if (this["versions"] && typeof this.versions.reload == "function") {
                        this.versions.reload();
                    }
                }

                this.tab.unmask();

                if(typeof callback == "function") {
                    callback();
                }

                if (this.willClose){
                    this.close();
                }

            }.bind(this),
            failure: function () {
                this.tab.unmask();
            }.bind(this),
            callback: function (){
                this.saving = false;
            }.bind(this),
            params: params
        });
    },
    close: function(){
        opendxp.helpers.closeAsset(this.id);
    },
    saveClose: function(){
        this.willClose = true;
        this.save(null);
    },
    remove: function () {
        var options = {
            "elementType" : "asset",
            "id": this.id
        };
        opendxp.elementservice.deleteElement(options);
    },

    isAllowed : function (key) {
        return this.data.userPermissions[key];
    },

    setType: function (type) {
        this.type = type;
    },

    getType: function () {
        return this.type;
    },

    reload: function () {
        this.tab.on("close", function() {
            var currentTabIndex = this.tab.ownerCt.items.indexOf(this.tab);
            window.setTimeout(function (id, type) {
                opendxp.helpers.openAsset(id, type, {tabIndex: currentTabIndex});
            }.bind(window, this.id, this.getType()), 500);
        }.bind(this));

        opendxp.helpers.closeAsset(this.id);
    },

    getMetaInfo: function() {
        return {
            id: this.data.id,
            path: this.data.path + this.data.filename,
            public_url: this.data.url,
            type: this.data.type + " (MIME: " + this.data.mimetype + ")",
            size: this.data.filesizeFormatted,
            modificationdate: this.data.modificationDate,
            creationdate: this.data.creationDate,
            usermodification: this.data.userModification,
            usermodification_name: this.data.userModificationFullname,
            userowner: this.data.userOwner,
            userowner_name: this.data.userOwnerFullname,
            deeplink: opendxp.helpers.getDeeplink("asset", this.data.id, this.data.type)
        };
    },

    showMetaInfo: function() {
        var metainfo = this.getMetaInfo();

        new opendxp.element.metainfo([
            {
                name: "id",
                value: metainfo.id
            }, {
                name: "path",
                value: metainfo.path
            }, {
                name: "public_url",
                value: metainfo.public_url
            }, {
                name: "type",
                value: metainfo.type
            }, {
                name: "size",
                value: metainfo.size
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
        ], "asset");
    },

    rename: function () {
        if (this.isAllowed("rename") && !this.data.locked) {
            var options = {
                elementType: "asset",
                elementSubType: this.getType(),
                id: this.id,
                default: this.data.filename
            }
            opendxp.elementservice.editElementKey(options);
        }
    },

    shareViaNotifications: function () {
        if (opendxp.globalmanager.get("user").isAllowed('notifications_send')) {
            var elementData = {
                id:this.id,
                type:'asset',
                published:true,
                path:this.data.path + this.data.filename
            };
            if (opendxp.globalmanager.get("new_notifications")) {
                opendxp.globalmanager.get("new_notifications").getWindow().destroy();
            }
            opendxp.globalmanager.add("new_notifications", new opendxp.notification.modal(elementData));        }
    }
});
