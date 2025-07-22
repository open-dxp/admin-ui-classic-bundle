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

opendxp.registerNS("opendxp.document.editables.link");
/**
 * @private
 */
opendxp.document.editables.link = Class.create(opendxp.document.editable, {

    initialize: function($super, id, name, config, data, inherited) {
        $super(id, name, config, data, inherited);

        this.defaultData = {
            path: "",
            parameters: "",
            anchor: "",
            accesskey: "",
            rel: "",
            tabindex: "",
            target: "",
            "class": ""
        };

        this.data = mergeObject(this.defaultData, data ?? {});
    },

    render: function() {
        this.setupWrapper();

        this.element = Ext.get(this.id);

        if (this.config["required"]) {
            this.required = this.config["required"];
        }

        this.checkValue();

        Ext.get(this.id).setStyle({
            display:"inline"
        });
        Ext.get(this.id).insertHtml("beforeEnd",'<span class="opendxp_editable_link_text">' + this.getLinkContent() + '</span>');

        var editButton = new Ext.Button({
            iconCls: "opendxp_icon_link opendxp_icon_overlay_edit",
            cls: "opendxp_edit_link_button",
            listeners: {
                "click": this.openEditor.bind(this)
            }
        });

        var openButton = new Ext.Button({
            iconCls: "opendxp_icon_open",
            cls: "opendxp_open_link_button",
            listeners: {
                "click": function () {
                    if (this.data && this.data.path) {
                        if (this.data.linktype == "internal") {
                            opendxp.helpers.openElement(this.data.path, this.data.internalType);
                        } else {
                            window.open(this.data.path, "_blank");
                        }
                    }
                }.bind(this)
            }
        });

        openButton.render(this.id);
        editButton.render(this.id);
    },

    openEditor: function () {

        // disable the global dnd handler in this editmode/frame
        window.dndManager.disable();

        this.window = opendxp.helpers.editmode.openLinkEditPanel(this.data, {
            empty: this.empty.bind(this),
            cancel: this.cancel.bind(this),
            save: this.save.bind(this)
        }, this.config);
    },


    getLinkContent: function () {
        let text = "[" + t("not_set") + "]";
        if (this.data.text) {
            text = this.data.text;
        } else if (this.data.path) {
            text = this.data.path;
        }
        let displayHtml = Ext.util.Format.htmlEncode(text);
        if (this.data.path || this.data.anchor || this.data.parameters) {
            let fullpath = Ext.util.Format.htmlEncode(this.data.path + (this.data.parameters ? '?' + this.data.parameters : '') + (this.data.anchor ? '#' + this.data.anchor : ''));
            let displayHtml = Ext.util.Format.htmlEncode(text);
            
            if (this.config.textPrefix !== undefined) {
                displayHtml = this.config.textPrefix + displayHtml;
            }
            if (this.config.textSuffix !== undefined) {
                displayHtml += this.config.textSuffix;
            }

            return '<a href="' + fullpath + '" class="' + this.config["class"] + ' ' + this.data["class"] + '">' + displayHtml + '</a>';
        }
        return displayHtml;
    },

    save: function () {

        // enable the global dnd dropzone again
        window.dndManager.enable();

        var values = this.window.getComponent("form").getForm().getFieldValues();
        this.data = values;
        this.checkValue(true);

        // close window
        this.window.close();

        // set text
        Ext.get(this.id).query(".opendxp_editable_link_text")[0].innerHTML = this.getLinkContent();

        this.reload();
    },

    reload : function () {
        if (this.config.reload) {
            this.reloadDocument();
            this.checkValue(true);
        }
    },

    empty: function () {

        // enable the global dnd dropzone again
        window.dndManager.enable();

        // close window
        this.window.close();

        this.data = this.defaultData;
        this.checkValue(true);

        // set text
        Ext.get(this.id).query(".opendxp_editable_link_text")[0].innerHTML = this.getLinkContent();
    },

    cancel: function () {

        // enable the global dnd dropzone again
        window.dndManager.enable();

        this.window.close();
    },

    checkValue: function (mark) {
        var data = this.getValue();
        var text = '';

        if (this.required) {
            if (this.required === "linkonly") {
                if (this.data.path) {
                    text = this.data.path;
                }
            } else {
                if (this.data.text && this.data.path) {
                    text = this.data.text + this.data.path;
                }
            }

            this.validateRequiredValue(text, this.element, this, mark);
        }
    },

    getValue: function () {
        return this.data;
    },

    getType: function () {
        return "link";
    }
});
