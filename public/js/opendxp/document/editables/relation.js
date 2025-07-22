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

opendxp.registerNS("opendxp.document.editables.relation");
/**
 * @private
 */
opendxp.document.editables.relation = Class.create(opendxp.document.editable, {

    initialize: function($super, id, name, config, data, inherited) {
        $super(id, name, config, data, inherited);

        this.data = {
            id: null,
            path: "",
            type: ""
        };

        if (data) {
            this.data = data;
            this.config.value = this.data.path;
        }

        this.config.enableKeyEvents = true;

        if(typeof this.config.emptyText == "undefined") {
            this.config.emptyText = t("drop_element_here");
        }

        this.config.name = id + "_editable";
    },

    render: function () {
        this.setupWrapper();

        if (!this.config.width) {
            this.config.width = Ext.get(this.id).getWidth() ?? Ext.get(this.id).getWidth() - 2;
        }

        const buttons = [
            {
                xtype: "button",
                iconCls: "opendxp_icon_open",
                style: "margin-left: 5px;",
                handler: this.openElement.bind(this)
            }, {
                xtype: "button",
                iconCls: "opendxp_icon_delete",
                style: "margin-left: 5px",
                handler: this.empty.bind(this)
            }
        ];

        if(opendxp.helpers.hasSearchImplementation()){
            buttons.push({
                xtype: "button",
                iconCls: "opendxp_icon_search",
                style: "margin-left: 5px",
                handler: this.openSearchEditor.bind(this)
            });
        }

        this.buttonsForm = Ext.create('Ext.form.FieldContainer', {
            layout: 'hbox',
            items: buttons
        });

        // Create temporary element with only icons, get its width, subtract total width with 
        // created element width and then destroy temporary element
        this.buttonsForm.render(this.id);
        this.config.width = this.config.width - Ext.get(this.buttonsForm.id).getWidth();
        this.buttonsForm.destroy();

        this.element = new Ext.form.TextField(this.config);

        this.element.on("render", function (el) {
            // register at global DnD manager
            dndManager.addDropTarget(el.getEl(), this.onNodeOver.bind(this), this.onNodeDrop.bind(this));

            el.getEl().on("contextmenu", this.onContextMenu.bind(this));
        }.bind(this));

        // disable typing into the textfield
        this.element.on("keyup", function (element, event) {
            element.setValue(this.data.path);
        }.bind(this));

        var items = [this.element].concat(buttons);

        this.composite = Ext.create('Ext.form.FieldContainer', {
            layout: 'hbox',
            items: items
        });

        this.composite.render(this.id);
    },

    uploadDialog: function () {
        opendxp.helpers.assetSingleUploadDialog(this.config["uploadPath"], "path", function (res) {
            try {
                var data = Ext.decode(res.response.responseText);
                if(data["id"]) {

                    if (this.config["subtypes"]) {
                        var found = false;
                        var typeKeys = Object.keys(this.config.subtypes);
                        for (var st = 0; st < typeKeys.length; st++) {
                            for (var i = 0; i < this.config.subtypes[typeKeys[st]].length; i++) {
                                if (this.config.subtypes[typeKeys[st]][i] == data["type"]) {
                                    found = true;
                                    break;
                                }
                            }
                        }
                        if (!found) {
                            return false;
                        }
                    }

                    this.data.id = data["id"];
                    this.data.subtype = data["type"];
                    this.data.elementType = "asset";
                    this.data.path = data["fullpath"];
                    this.element.setValue(data["fullpath"]);
                }
            } catch (e) {
                console.log(e);
            }
        }.bind(this));
    },

    onNodeOver: function(target, dd, e, data) {
        var record = data.records[0];

        record = this.getCustomOpenDxpDropData(record);
        if (data.records.length === 1 && this.dndAllowed(record)) {
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

        var record = data.records[0];
        record = this.getCustomOpenDxpDropData(record);

        if(!this.dndAllowed(record)){
            return false;
        }


        this.data.id = record.data.id;
        this.data.subtype = record.data.type;
        this.data.elementType = record.data.elementType;
        this.data.path = record.data.path;

        this.element.setValue(record.data.path);

        if (this.config.reload) {
            this.reloadDocument();
        }

        return true;
    },

    dndAllowed: function(data) {

        var i;
        var found;

        var checkSubType = false;
        var checkClass = false;
        var type;

        //only is legacy
        if (this.config.only && !this.config.types) {
            this.config.types = [this.config.only];
        }

        //type check   (asset,document,object)
        if (this.config.types) {
            found = false;
            for (i = 0; i < this.config.types.length; i++) {
                type = this.config.types[i];
                if (type == data.data.elementType) {
                    found = true;

                    if((typeof this.config.subtypes !== "undefined") && this.config.subtypes[type] && this.config.subtypes[type].length) {
                        checkSubType = true;
                    }
                    if(data.data.elementType == "object" && this.config.classes) {
                        checkClass = true;
                    }
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }

        //subtype check  (folder,page,snippet ... )
        if (checkSubType) {

            found = false;
            var subTypes = this.config.subtypes[type];
            for (i = 0; i < subTypes.length; i++) {
                if (subTypes[i] == data.data.type) {
                    found = true;
                    break;
                }

            }
            if (!found) {
                return false;
            }
        }

        //object class check
        if (checkClass) {
            found = false;
            for (i = 0; i < this.config.classes.length; i++) {
                if (this.config.classes[i] == data.data.className) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }

        return true;
    },

    onContextMenu: function (e) {

        var menu = new Ext.menu.Menu();

        if(this.data["id"]) {
            menu.add(new Ext.menu.Item({
                text: t('empty'),
                iconCls: "opendxp_icon_delete",
                handler: this.empty.bind(this)
            }));

            menu.add(new Ext.menu.Item({
                text: t('open'),
                iconCls: "opendxp_icon_open",
                handler: this.openElement.bind(this)
            }));

            if (opendxp.elementservice.showLocateInTreeButton("document")) {
                menu.add(new Ext.menu.Item({
                    text: t('show_in_tree'),
                    iconCls: "opendxp_icon_show_in_tree",
                    handler: function (item) {
                        item.parentMenu.destroy();
                        opendxp.treenodelocator.showInTree(this.data.id, this.data.elementType);
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

        if((this.config["types"] && in_array("asset",this.config.types)) || !this.config["types"]) {
            menu.add(new Ext.menu.Item({
                text: t('upload'),
                cls: "opendxp_inline_upload",
                iconCls: "opendxp_icon_upload",
                handler: function (item) {
                    item.parentMenu.destroy();
                    this.uploadDialog();
                }.bind(this)
            }));
        }

        menu.showAt(e.getXY());

        e.stopEvent();
    },

    openSearchEditor: function () {

        //only is legacy
        if (this.config.only && !this.config.types) {
            this.config.types = [this.config.only];
        }

        opendxp.helpers.itemselector(false, this.addDataFromSelector.bind(this), {
            type: this.config.types,
            subtype: this.config.subtypes,
            specific: {
                classes: this.config["classes"]
            }
        }, {
            context: this.getContext()
        });
    },

    addDataFromSelector: function (item) {
        if (item) {
            this.data.id = item.id;
            this.data.subtype = item.subtype;
            this.data.elementType = item.type;
            this.data.path = item.fullpath;

            this.element.setValue(this.data.path);
            if (this.config.reload) {
                this.reloadDocument();
            }
        }
    },

    openElement: function () {
        if (this.data.id && this.data.elementType) {
            opendxp.helpers.openElement(this.data.id, this.data.elementType, this.data.subtype);
        }
    },

    empty: function () {
        this.data = {};
        this.element.setValue(this.data.path);
        if (this.config.reload) {
            this.reloadDocument();
        }
    },

    getValue: function () {
        return {
            id: this.data.id,
            type: this.data.elementType,
            subtype: this.data.subtype
        };
    },

    getType: function () {
        return "relation";
    }
});
