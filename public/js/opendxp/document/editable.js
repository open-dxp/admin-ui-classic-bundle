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

opendxp.registerNS("opendxp.document.editable");
/**
 * @private
 */
opendxp.document.editable = Class.create({

    id: null,
    name: null,
    realName: null,
    inherited: false,
    inDialogBox: null,
    required: false,
    requiredError: false,

    initialize: function(id, name, config, data, inherited) {
        this.id = id;
        this.name = name;
        this.config = this.parseConfig(config);
        this.inherited = inherited;
    },

    setupWrapper: function (styleOptions) {

        if (!styleOptions) {
            styleOptions = {};
        }

        var container = Ext.get(this.id);
        container.setStyle(styleOptions);

        return container;
    },

    setName: function(name) {
        this.name = name;
    },

    getName: function () {
        return this.name;
    },

    setRealName: function(realName) {
        this.realName = realName;
    },

    getRealName: function() {
        return this.realName;
    },

    setInDialogBox: function(inDialogBox) {
        this.inDialogBox = inDialogBox;
    },

    getInDialogBox: function() {
        return this.inDialogBox;
    },

    reloadDocument: function () {
        window.editWindow.reload();
    },

    setInherited: function(inherited, el) {
        this.inherited = inherited;

        // if an element given is as optional second parameter we use this for the mask
        if(!(el instanceof Ext.Element)) {
            el = Ext.get(this.id);
        }

        // check for inherited elements, and mask them if necessary
        if(this.inherited) {
            var mask = el.mask();
            new Ext.ToolTip({
                target: mask,
                html: t("click_right_to_overwrite")
            });
            mask.on("contextmenu", function (e) {
                var menu = new Ext.menu.Menu();
                menu.add(new Ext.menu.Item({
                    text: t('overwrite'),
                    iconCls: "opendxp_icon_overwrite",
                    handler: function (item) {
                        this.setInherited(false);
                    }.bind(this)
                }));
                menu.showAt(e.getXY());

                e.stopEvent();
            }.bind(this));
        } else {
            el.unmask();
        }
    },

    getInherited: function () {
        return this.inherited;
    },

    setId: function (id) {
        this.id = id;
    },

    getId: function () {
        return this.id;
    },

    parseConfig: function (config) {
        if(!config || config instanceof Array || typeof config != "object") {
            config = {};
        }

        return config;
    },

    /**
     * HACK to get custom data from a grid instead of the tree
     * better solutions are welcome ;-)
     */
    getCustomOpenDxpDropData : function (data){
        if(typeof(data.grid) != 'undefined' && typeof(data.grid.getCustomOpenDxpDropData) == 'function'){ //droped from priceList
             var record = data.grid.getStore().getAt(data.rowIndex);
             var data = data.grid.getCustomOpenDxpDropData(record);
         }
        return data;
    },

    getContext: function() {
        var context = {
            scope: "documentEditor",
            containerType: "document",
            documentId: opendxp_document_id,
            fieldname: this.name
        }
        return context;
    },

    validateRequiredValue: function(value, el, parent, mark) {
        let valueLength = 1;
        if (typeof value === "string") {
            valueLength = trim(strip_tags(value)).length;
        } else if (value == null) {
            valueLength = 0;
        }

        if (valueLength < 1) {
            parent.requiredError = true;
            if (mark) {
                el.addCls('editable-error');
            }
        } else {
            parent.requiredError = false;
            if (mark) {
                el.removeCls('editable-error');
            }
        }
    }
});

