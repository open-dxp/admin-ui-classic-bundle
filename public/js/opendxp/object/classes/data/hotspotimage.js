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

opendxp.registerNS("opendxp.object.classes.data.hotspotimage");
/**
 * @private
 */
opendxp.object.classes.data.hotspotimage = Class.create(opendxp.object.classes.data.image, {

    type: "hotspotimage",
    /**
     * define where this datatype is allowed
     */
    allowIn: {
        object: true,
        objectbrick: true,
        fieldcollection: true,
        localizedfield: true,
        classificationstore: false,
        block: true
    },

    initialize: function (treeNode, initData) {
        this.type = "hotspotimage";

        this.initData(initData);

        // overwrite default settings
        this.availableSettingsFields = ["name", "title", "tooltip", "mandatory", "noteditable", "invisible",
            "visibleGridView", "visibleSearch", "style"];

        this.treeNode = treeNode;
    },

    getTypeName: function () {
        return t("imageadvanced");
    },

    getIconClass: function () {
        return "opendxp_icon_hotspotimage";
    },

    getGroup: function () {
        return "media";
    },

    getLayout: function ($super) {

        $super();

        if (!this.isInCustomLayoutEditor()) {
            this.specificPanel.add({
                xtype: "fieldset",
                title: t("crop"),
                style: "margin-top: 10px;",
                items: [{
                    xtype: "numberfield",
                    fieldLabel: t("ratio") + " X",
                    name: "ratioX",
                    value: this.datax.ratioX
                },
                    {
                        xtype: "numberfield",
                        fieldLabel: t("ratio") + " Y",
                        name: "ratioY",
                        value: this.datax.ratioY
                    },
                    {
                        xtype: "textarea",
                        name: "predefinedDataTemplates",
                        height: 300,
                        width: "100%",
                        value: this.datax.predefinedDataTemplates,
                        validator: function (value) {
                            if (Ext.isString(value) && value.length > 3)
                                try {
                                    Ext.decode(value);
                                    return true;
                                } catch (e) {
                                    return false;
                                }
                        },
                        fieldLabel: t("predefined_hotspot_data_templates")
                    }
                ]
            });
        }

        return this.layout;
    },

    applySpecialData: function (source) {
        if (source.datax) {
            if (!this.datax) {
                this.datax = {};
            }
            Ext.apply(this.datax,
                {
                    width: source.datax.width,
                    height: source.datax.height,
                    uploadPath: source.datax.uploadPath,
                    ratioX: source.datax.ratioX,
                    ratioY: source.datax.ratioY,
                    predefinedDataTemplates: source.datax.predefinedDataTemplates
                });
        }
    }
});
