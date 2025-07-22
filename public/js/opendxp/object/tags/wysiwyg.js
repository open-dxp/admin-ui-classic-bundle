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

opendxp.registerNS("opendxp.object.tags.wysiwyg");
/**
 * @private
 */
opendxp.object.tags.wysiwyg = Class.create(opendxp.object.tags.abstract, {

    type: "wysiwyg",

    initialize: function (data, fieldConfig) {
        this.data = "";
        if (data) {
            this.data = data;
        }
        this.fieldConfig = fieldConfig;
        this.editableDivId = "object_wysiwyg_" + uniqid();
        this.dirty = false;
    },

    /**
     * @extjs since HTMLEditor seems not working properly in grid, this feature is deactivated for now
     */
    /*getGridColumnEditor: function(field) {
        if (field.layout.noteditable) {
            return null;
        }
        // WYSIWYG
        if (field.type == 'wysiwyg') {
            return Ext.create('Ext.form.HtmlEditor', {
                width: 500,
                height: 300
            });
        }
    },*/


    getGridColumnConfig: function (field) {
        var renderer = function (key, value, metaData, record) {
            this.applyPermissionStyle(key, value, metaData, record);

            try {
                if (record.data.inheritedFields && record.data.inheritedFields[key] && record.data.inheritedFields[key].inherited == true) {
                    metaData.tdCls += " grid_value_inherited";
                }
            } catch (e) {
                console.log(e);
            }
            return value;

        }.bind(this, field.key);

        return {
            text: t(field.label), sortable: true, dataIndex: field.key, renderer: renderer,
            getEditor: this.getWindowCellEditor.bind(this, field)
        };
    },


    getGridColumnFilter: function (field) {
        return {type: 'string', dataIndex: field.key};
    },

    getLayout: function () {

        var iconCls = null;
        if(this.fieldConfig.noteditable == false) {
            iconCls = "opendxp_icon_droptarget";
        }

        var html = '<div class="opendxp_editable_wysiwyg" id="' + this.editableDivId + '" contenteditable="true">' + this.data + '</div>';
        var pConf = {
            iconCls: iconCls,
            title: this.fieldConfig.title,
            html: html,
            border: true,
            bodyStyle: 'background: #fff',
            style: "margin-bottom: 10px",
            manageHeight: false,
            cls: "object_field object_field_type_" + this.type
        };

        if(this.fieldConfig.width) {
            pConf["width"] = this.fieldConfig.width;
        }

        if(this.fieldConfig.height) {
            pConf["height"] = this.fieldConfig.height;
            pConf["autoScroll"] = true;
        } else {
            pConf["autoHeight"] = true;
            pConf["autoScroll"] = true;
        }

        this.component = new Ext.Panel(pConf);
    },

    getLayoutShow: function () {
        this.getLayout();
        this.component.on("afterrender", function() {
            Ext.get(this.editableDivId).dom.setAttribute("contenteditable", "false");
        }.bind(this));
        this.component.disable();
        return this.component;
    },

    getLayoutEdit: function () {
        this.getLayout();
        this.component.on("afterlayout", this.startWysiwygEditor.bind(this));

        if(this.ddWysiwyg) {
            this.component.on("beforedestroy", function () {
                const beforeDestroyWysiwyg = new CustomEvent(opendxp.events.beforeDestroyWysiwyg, {
                    detail: {
                        context: "object",
                    },
                });
                document.dispatchEvent(beforeDestroyWysiwyg);
            }.bind(this));
        }

        return this.component;
    },

    startWysiwygEditor: function () {

        if(this.ddWysiwyg) {
            return;
        }

        const initializeWysiwyg = new CustomEvent(opendxp.events.initializeWysiwyg, {
            detail: {
                config: this.fieldConfig,
                context: "object"
            },
            cancelable: true
        });
        const initIsAllowed = document.dispatchEvent(initializeWysiwyg);
        if(!initIsAllowed) {
            return;
        }

        const createWysiwyg = new CustomEvent(opendxp.events.createWysiwyg, {
            detail: {
                textarea: this.editableDivId,
                context: "object",
            },
            cancelable: true
        });
        const createIsAllowed = document.dispatchEvent(createWysiwyg);
        if(!createIsAllowed) {
            return;
        }

        document.addEventListener(opendxp.events.changeWysiwyg, function (e) {
            if (this.editableDivId === e.detail.e.target.id) {
                this.setValue(e.detail.data);
            }
        }.bind(this));

        if (!parent.opendxp.wysiwyg.editors.length) {
            Ext.get(this.editableDivId).dom.addEventListener("keyup", (e) => {
                this.setValue(Ext.get(this.editableDivId).dom.innerText);
            });
        }

        // add drop zone, use the parent panel here (container), otherwise this can cause problems when specifying a fixed height on the wysiwyg
        this.ddWysiwyg = new Ext.dd.DropZone(Ext.get(this.editableDivId).parent(), {
            ddGroup: "element",

            getTargetFromEvent: function(e) {
                return this.getEl();
            },

            onNodeOver : function(target, dd, e, data) {
                if (data.records.length === 1 && this.dndAllowed(data.records[0].data)) {
                    return Ext.dd.DropZone.prototype.dropAllowed;
                }
            }.bind(this),

            onNodeDrop : this.onNodeDrop.bind(this)
        });
    },

    onNodeDrop: function (target, dd, e, data) {
        if (!opendxp.helpers.dragAndDropValidateSingleItem(data) || !this.dndAllowed(data.records[0].data) || this.inherited) {
            return false;
        }

        const onDropWysiwyg = new CustomEvent(opendxp.events.onDropWysiwyg, {
            detail: {
                target: target,
                dd: dd,
                e: e,
                data: data,
                context: "object",
                textareaId: this.editableDivId
            },
        });

        document.dispatchEvent(onDropWysiwyg);
    },

    dndAllowed: function(data) {

        if (data.elementType == "document" && (data.type=="page"
            || data.type=="hardlink" || data.type=="link")){
            return true;
        } else if (data.elementType=="asset" && data.type != "folder"){
            return true;
        } else if (data.elementType=="object" && data.type != "folder"){
            return true;
        }

        return false;
    },

    getValue: function () {
        return this.data;
    },

    setValue: function (value) {
        this.dirty = true;
        this.data = value;
    },

    getName: function () {
        return this.fieldConfig.name;
    },

    isDirty: function() {
        if(!this.isRendered()) {
            return false;
        }

        return this.dirty;
    },

    getWindowCellEditor: function (field, record) {
        return new opendxp.element.helpers.gridCellEditor({
                fieldInfo: field,
                elementType: "object"
            }
        );
    },

    getCellEditValue: function () {
        return this.getValue();
    }
});
