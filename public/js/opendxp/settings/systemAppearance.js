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

opendxp.registerNS("opendxp.settings.appearance");
/**
 * @private
 */
opendxp.settings.appearance = Class.create({

    initialize: function () {

        this.getData();
    },

    getData: function () {
        Ext.Ajax.request({
            url: Routing.generate('opendxp_appearance_admin_settings_get'),
            success: function (response) {

                this.data = Ext.decode(response.responseText);
                this.getTabPanel();

            }.bind(this)
        });
    },

    getValue: function (key, ignoreCheck) {

        const nk = key.split("\.");
        let current = this.data.values;

        for (let i = 0; i < nk.length; i++) {
            if (typeof current[nk[i]] != "undefined") {
                current = current[nk[i]];
            } else {
                current = null;
                break;
            }
        }

        if (ignoreCheck || (typeof current != "object" && typeof current != "array" && typeof current != "function")) {
            return current;
        }

        return "";
    },

    getTabPanel: function () {
        let urlToCustomImageField = {};

        if (!this.panel) {
            this.panel = Ext.create('Ext.panel.Panel', {
                id: "opendxp_settings_system_appearance",
                title: t("appearance_and_branding"),
                iconCls: "opendxp_icon_appearance",
                border: false,
                layout: "fit",
                closable: true
            });

            this.panel.on("destroy", function () {
                opendxp.globalmanager.remove("settings_system_appearance");
            }.bind(this));

            this.layout = Ext.create('Ext.form.Panel', {
                bodyStyle: 'padding:20px 5px 20px 5px;',
                border: false,
                autoScroll: true,
                forceLayout: true,
                defaults: {
                    forceLayout: true
                },
                fieldDefaults: {
                    labelWidth: 250
                },
                buttons: [
                    {
                        text: t("save"),
                        handler: this.save.bind(this),
                        iconCls: "opendxp_icon_apply",
                        disabled: !this.getValue("writeable")
                    }
                ],
                items: [
                    {
                            xtype: 'fieldset',
                            title: t('colors'),
                            collapsible: true,
                            width: "100%",
                            autoHeight: true,
                            items: [{
                                xtype: "container",
                                html: t('color_description'),
                                style: "margin-bottom:10px;"
                            }, {
                                xtype: "textfield",
                                fieldLabel: t('login_screen'),
                                width: 330,
                                value: this.getValue("branding.color_login_screen"),
                                name: 'branding.color_login_screen'
                            }, {
                                xtype: "textfield",
                                fieldLabel: t('admin_interface'),
                                width: 330,
                                value: this.getValue("branding.color_admin_interface"),
                                name: 'branding.color_admin_interface'
                            }, {
                                xtype: "textfield",
                                fieldLabel: t('admin_interface_background'),
                                width: 330,
                                value: this.getValue("branding.color_admin_interface_background"),
                                name: 'branding.color_admin_interface_background'
                            }, {
                                xtype: "checkbox",
                                boxLabel: t('invert_colors_on_login_screen'),
                                width: 330,
                                checked: this.getValue("branding.login_screen_invert_colors"),
                                name: 'branding.login_screen_invert_colors'
                            }]
                        }, {
                            xtype: 'fieldset',
                            title: t('custom_logo'),
                            collapsible: true,
                            width: "100%",
                            autoHeight: true,
                            items: [{
                                xtype: "container",
                                html: t('branding_logo_description'),
                                style: "margin-bottom:10px;"
                            }, {
                                xtype: "container",
                                id: "opendxp_custom_branding_logo",
                                html: '<img src="'+Routing.generate('opendxp_settings_display_custom_logo')+'" />',
                            }, {
                                xtype: "button",
                                text: t("upload"),
                                iconCls: "opendxp_icon_upload",
                                handler: function () {
                                    opendxp.helpers.uploadDialog(Routing.generate('opendxp_admin_settings_uploadcustomlogo'), null,
                                        function () {
                                            const cont = Ext.getCmp("opendxp_custom_branding_logo");
                                            const date = new Date();
                                            cont.update('<img src="'+Routing.generate('opendxp_settings_display_custom_logo', {'_dc': date.getTime()})+'" />');
                                        }.bind(this));
                                }.bind(this),
                                flex: 1
                            }, {
                                xtype: "button",
                                text: t("delete"),
                                iconCls: "opendxp_icon_delete",
                                handler: function () {
                                    Ext.Ajax.request({
                                        url: Routing.generate('opendxp_admin_settings_deletecustomlogo'),
                                        method: "DELETE",
                                        success: function (response) {
                                            const cont = Ext.getCmp("opendxp_custom_branding_logo");
                                            const date = new Date();
                                            cont.update('<img src="' + Routing.generate('opendxp_settings_display_custom_logo', {'_dc': date.getTime()}) + '" />');
                                        }
                                    });
                                }.bind(this),
                                flex: 1
                            }]
                        }, {
                            xtype: 'fieldset',
                            title: t('custom_login_background_image'),
                            collapsible: true,
                            width: "100%",
                            layout: 'hbox',
                            autoHeight: true,
                            items: [{
                                fieldLabel: t("url_to_custom_image_on_login_screen"),
                                xtype: "textfield",
                                name: "branding.login_screen_custom_image",
                                fieldCls: "input_drop_target",
                                width: '95%',
                                value: this.getValue("branding.login_screen_custom_image"),
                                listeners: {
                                    "render": function (el) {
                                        urlToCustomImageField = el;
                                        new Ext.dd.DropZone(el.getEl(), {
                                            reference: this,
                                            ddGroup: "element",
                                            getTargetFromEvent: function (e) {
                                                return this.getEl();
                                            },

                                            onNodeOver: function (target, dd, e, data) {
                                                if (data.records.length === 1 && data.records[0].data.elementType === "asset") {
                                                    return Ext.dd.DropZone.prototype.dropAllowed;
                                                }
                                            },

                                            onNodeDrop: function (target, dd, e, data) {

                                                if (!opendxp.helpers.dragAndDropValidateSingleItem(data)) {
                                                    return false;
                                                }

                                                data = data.records[0].data;
                                                if (data.elementType === "asset") {
                                                    this.setValue(data.path);
                                                    return true;
                                                }
                                                return false;
                                            }.bind(this)
                                        });
                                    }
                                },
                            }, {
                                xtype: "button",
                                tooltip: t("delete"),
                                overflowText: t('delete'),
                                iconCls: "opendxp_icon_delete",
                                style: "margin-top: 5px; margin-left: 7px",
                                handler: function () {
                                    urlToCustomImageField.setValue('');
                                }
                            }]
                        },  {
                        xtype: 'fieldset',
                        title: t('assets'),
                        collapsible: true,
                        collapsed: false,
                        autoHeight: true,
                        labelWidth: 250,
                        defaultType: 'textfield',
                        defaults: {width: 600},
                        items: [
                            {
                                boxLabel: t("hide_edit_image_tab"),
                                xtype: "checkbox",
                                name: "assets.hide_edit_image",
                                checked: this.getValue("assets.hide_edit_image")
                            },
                            {
                                boxLabel: t("disable_tree_preview"),
                                xtype: "checkbox",
                                name: "assets.disable_tree_preview",
                                checked: this.getValue("assets.disable_tree_preview")
                            }
                        ]
                    }
                ]
            });

            this.panel.add(this.layout);

            const tabPanel = Ext.getCmp("opendxp_panel_tabs");
            tabPanel.add(this.panel);
            tabPanel.setActiveItem(this.panel);

            opendxp.layout.refresh();
        }

        return this.panel;
    },

    activate: function () {
        const tabPanel = Ext.getCmp("opendxp_panel_tabs");
        tabPanel.setActiveItem("opendxp_settings_system_appearance");
    },

    save: function () {

        this.layout.mask();

        const values = this.layout.getForm().getFieldValues();

        Ext.Ajax.request({
            url: Routing.generate('opendxp_admin_settings_appearance_set'),
            method: "PUT",
            params: {
                data: Ext.encode(values)
            },
            success: function (response) {

                this.layout.unmask();

                try {
                    const res = Ext.decode(response.responseText);
                    if (res.success) {
                        opendxp.helpers.showNotification(t("success"), t("saved_successfully"), "success");

                        Ext.MessageBox.confirm(t("info"), t("reload_opendxp_changes"), function (buttonValue) {
                            if (buttonValue == "yes") {
                                window.location.reload();
                            }
                        }.bind(this));
                    } else {
                        opendxp.helpers.showNotification(t("error"), t("saving_failed"),
                            "error", t(res.message));
                    }
                } catch (e) {
                    opendxp.helpers.showNotification(t("error"), t("saving_failed"), "error");
                }
            }.bind(this)
        });
    }
});
