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

opendxp.registerNS("opendxp.settings.translation.editor");
/**
 * @private
 */
opendxp.settings.translation.editor = Class.create({
    
    initialize: function (context, field, translationType, editorType) {

        Ext.WindowManager.each(function(window, idx, length) {
            window.destroy();
        });

        this.field = field;
        this.context = context;
        this.value = field.getValue();

        let bbar = [];

        if (editorType === 'wysiwyg') {
            this.editableDivId = "translationeditor_" + uniqid();

            var html = '<div class="opendxp_editable_wysiwyg" id="' + this.editableDivId + '" contenteditable="true">' + this.value + '</div>';
            var pConf = {
                html: html,
                border: true,
                style: "margin-bottom: 10px",
                height: '100%',
                autoScroll: true
            };

            this.component = new Ext.Panel(pConf);

            this.component.on("afterlayout", this.startWysiwygEditor.bind(this));

            if(this.ddWysiwyg) {
                this.component.on("beforedestroy", function () {
                        const beforeDestroyWysiwyg = new CustomEvent(opendxp.events.beforeDestroyWysiwyg, {
                            detail: {
                                context: "object",
                            },
                        });
                        document.dispatchEvent(beforeDestroyWysiwyg);
                    }.bind(this)
                );
            }
        } else {
            this.component = new Ext.form.TextArea({
                width: '100%',
                height: '100%',
                value: this.value,
            });

            if(translationType === 'custom') {
                bbar.push({
                    xtype: "displayfield",
                    value: t('symfony_translation_link')
                });
            }
        }

        bbar.push({
            text: t("save"),
            iconCls: 'opendxp_icon_save',
            handler: function () {
                let newValue = '';
                if (editorType == "wysiwyg") {
                   newValue = this.value;
                } else {
                    newValue = this.component.getValue();
                }

                this.field.setValue(newValue);
                this.context.setValueStatus(this.field, newValue);

                this.editWin.close();
            }.bind(this)
        });

        bbar.push({
            text: t("cancel"),
            iconCls: 'opendxp_icon_cancel',
            handler: function () {
                this.editWin.close();
            }.bind(this)
        });

        this.editWin = new Ext.Window({
            modal: false,
            items: [this.component],
            bodyStyle: "background: #fff; padding: 10px",
            width: 700,
            height: 400,
            layout: 'fit',
            closeAction: 'method-destroy',
            autoScroll: true,
            preventRefocus: true,      // nasty hack because this is an internal property
                                       // for html grid cell values with hrefs this prevents that the cell
                                       // gets refocused which would then trigger another editor window
                                       // upon close of this instance
            bbar: bbar
        });


        this.editWin.show();
        this.editWin.updateLayout();
    },

    destroy: function () {
        if (this.editWin) {
            this.editWin.destroy();
        }
    },

    startWysiwygEditor: function () {
        if(this.ddWysiwyg) {
            return;
        }

        const initializeWysiwyg = new CustomEvent(opendxp.events.initializeWysiwyg, {
            detail: {
                config: {},
                context: "translation"
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
                context: "translation",
            },
            cancelable: true
        });
        const createIsAllowed = document.dispatchEvent(createWysiwyg);
        if(!createIsAllowed) {
            return;
        }

        document.addEventListener(opendxp.events.changeWysiwyg, function (e) {
            if (this.editableDivId === e.detail.e.target.id) {
                this.value = e.detail.data;
            }
        }.bind(this));

        if (!parent.opendxp.wysiwyg.editors.length) {
            Ext.get(this.editableDivId).dom.addEventListener("keyup", (e) => {
                this.value = Ext.get(this.editableDivId).dom.innerText;
            });
        }

        // add drop zone, use the parent panel here (container), otherwise this can cause problems when specifying a fixed height on the wysiwyg
        this.ddWysiwyg = new Ext.dd.DropZone(Ext.get(this.editableDivId).parent(), {
            ddGroup: "element",

            getTargetFromEvent: function(e) {
                return this.getEl();
            },

            onNodeOver : function(target, dd, e, data) {
                if (data.records.length == 1) {
                    if (this.dndAllowed(data.records[0].data)) {
                        return Ext.dd.DropZone.prototype.dropAllowed;
                    }
                }
                return Ext.dd.DropZone.prototype.dropNotAllowed;

            }.bind(this),

            onNodeDrop: this.onNodeDrop.bind(this)
        });

    },

    onNodeDrop: function (target, dd, e, data) {
        if (!opendxp.helpers.dragAndDropValidateSingleItem(data)) {
            return;
        }

        const onDropWysiwyg = new CustomEvent(opendxp.events.onDropWysiwyg, {
            detail: {
                target: target,
                dd: dd,
                e: e,
                data: data,
                context: "translation",
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
    }
});
