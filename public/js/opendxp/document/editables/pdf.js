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

opendxp.registerNS("opendxp.document.editables.pdf");
/**
 * @private
 */
opendxp.document.editables.pdf = Class.create(opendxp.document.editable, {

    initialize: function($super, id, name, config, data, inherited) {
        $super(id, name, config, data, inherited);

        this.data = data ?? {};

        if (!this.config["height"]) {
            this.config.height = 100;
        }

        this.config.name = id + "_editable";
    },

    render: function () {
        this.setupWrapper();
        this.element = new Ext.Panel(this.config);
        this.element.on("render", function (el) {

            // contextmenu
            el.getEl().on("contextmenu", this.onContextMenu.bind(this));

            // register at global DnD manager
            dndManager.addDropTarget(el.getEl(), this.onNodeOver.bind(this), this.onNodeDrop.bind(this));

            el.getEl().setStyle({
                position: "relative"
            });

            var body = this.getBody();
            body.insertHtml("beforeEnd",'<div class="opendxp_editable_droptarget"></div>');
            body.addCls("opendxp_editable_image_empty");
        }.bind(this));

        this.element.render(this.id);

        opendxp.helpers.registerAssetDnDSingleUpload(this.element.getEl().dom, this.config["uploadPath"], 'path', function (e) {
            if (e['asset']['type'] === "document" && !this.inherited) {
                this.resetData();
                this.data.id = e['asset']['id'];

                this.updateImage();
                this.reload();

                return true;
            } else {
                opendxp.helpers.showNotification(t("error"), t('unsupported_filetype'), "error");
            }
        }.bind(this));

        // insert image
        if (this.data) {
            this.updateImage();
        }
    },

    onContextMenu: function (e) {

        var menu = new Ext.menu.Menu();

        if(this.data.id) {
            menu.add(new Ext.menu.Item({
                text: t('empty'),
                iconCls: "opendxp_icon_delete",
                handler: function (item) {
                    item.parentMenu.destroy();

                    this.empty();

                }.bind(this)
            }));
            menu.add(new Ext.menu.Item({
                text: t('open'),
                iconCls: "opendxp_icon_open",
                handler: function (item) {
                    item.parentMenu.destroy();
                    opendxp.helpers.openAsset(this.data.id, "document");
                }.bind(this)
            }));

            if (opendxp.elementservice.showLocateInTreeButton("document")) {
                menu.add(new Ext.menu.Item({
                    text: t('show_in_tree'),
                    iconCls: "opendxp_icon_show_in_tree",
                    handler: function (item) {
                        item.parentMenu.destroy();
                        opendxp.treenodelocator.showInTree(this.data.id, "asset");
                    }.bind(this)
                }));
            }
        }

        if(opendxp.helpers.hasSearchImplementation()) {
            menu.add(new Ext.menu.Item({
                text: t('search'),
                iconCls: "opendxp_icon_search",
                handler: function (item) {
                    item.parentMenu.destroy();
                    this.openSearchEditor();
                }.bind(this)
            }));
        }

        menu.add(new Ext.menu.Item({
            text: t('upload'),
            iconCls: "opendxp_icon_upload",
            handler: function (item) {
                item.parentMenu.destroy();
                this.uploadDialog();
            }.bind(this)
        }));

        menu.showAt(e.getXY());
        e.stopEvent();
    },

    uploadDialog: function () {
        opendxp.helpers.assetSingleUploadDialog(this.config["uploadPath"], "path", function (res) {
            try {
                var data = Ext.decode(res.response.responseText);
                if(data["id"] && data["type"] == "document") {
                    this.resetData();
                    this.data.id = data["id"];

                    this.updateImage();
                    this.reload();
                }
            } catch (e) {
                console.log(e);
            }
        }.bind(this));
    },

    onNodeOver: function(target, dd, e, data) {
        if (data.records.length === 1 && this.dndAllowed(data.records[0])) {
            return Ext.dd.DropZone.prototype.dropAllowed;
        }
        else {
            return Ext.dd.DropZone.prototype.dropNotAllowed;
        }
    },

    onNodeDrop: function (target, dd, e, data) {

        if(!opendxp.helpers.dragAndDropValidateSingleItem(data)) {
            return false;
        }

        data = data.records[0].data;
        if (data.elementType === "asset" && data.type === "document") {
            this.resetData();
            this.data.id = data.id;

            this.updateImage();
            this.reload();

            return true;
        }
    },

    dndAllowed: function(record) {

        if(record.data.elementType !== "asset" || record.data.type !== "document"){
            return false;
        } else {
            return true;
        }

    },

    openSearchEditor: function () {
        opendxp.helpers.itemselector(false, this.addDataFromSelector.bind(this), {
            type: ["asset"],
            subtype: {
                asset: ["document"]
            }
        },
            {
                context: this.getContext()
            });
    },

    addDataFromSelector: function (item) {
        if(item) {
            this.resetData();
            this.data.id = item.id;

            this.updateImage();
            this.reload();

            return true;
        }
    },

    resetData: function () {
        this.data = {
            id: null
        };
    },

    empty: function () {

        this.resetData();

        this.updateImage();
        this.getBody().addCls("opendxp_editable_image_empty");
        this.reload();
    },

    getBody: function () {
        // get the id from the body element of the panel because there is no method to set body's html
        // (only in configure)
        var body = Ext.get(this.element.getEl().query("." + Ext.baseCSSPrefix + "autocontainer-innerCt")[0]);
        return body;
    },

    updateImage: function () {
        var existingImage = this.getBody().dom.getElementsByTagName("img")[0];
        if (existingImage) {
            Ext.get(existingImage).remove();
        }

        if (!this.data.id) {
            return;
        }

        var params = this.data;
        params['width'] = this.element.getEl().getWidth();
        params['aspectratio'] = true;

        var path = Routing.generate('opendxp_admin_asset_getdocumentthumbnail', params)

        var image = document.createElement("img");
        image.src = path;

        this.getBody().appendChild(image);
        this.getBody().removeCls("opendxp_editable_image_empty");

        this.updateCounter = 0;
        this.updateDimensionsInterval = window.setInterval(this.updateDimensions.bind(this), 1000);
    },

    reload : function () {
        this.reloadDocument();
    },

    updateDimensions: function () {

        var image = this.element.getEl().dom.getElementsByTagName("img")[0];
        if (!image) {
            return;
        }
        image = Ext.get(image);

        var width = image.getWidth();
        var height = image.getHeight();

        if (width > 1 && height > 1) {
            this.element.setWidth(width);
            this.element.setHeight(height);

            clearInterval(this.updateDimensionsInterval);
        }

        if (this.updateCounter > 20) {
            // only wait 20 seconds until image must be loaded
            clearInterval(this.updateDimensionsInterval);
        }

        this.updateCounter++;
    },

    getValue: function () {
        return this.data;
    },

    getType: function () {
        return "pdf";
    }
});
