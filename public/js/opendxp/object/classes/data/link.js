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

opendxp.registerNS("opendxp.object.classes.data.link");
/**
 * @private
 */
opendxp.object.classes.data.link = Class.create(opendxp.object.classes.data.data, {
    targets: ['', '_blank', '_self', '_top', '_parent'],
    types: ['asset', 'document', 'object'],
    fields: ['text', 'target', 'parameters', 'anchor', 'title', 'accesskey', 'rel', 'tabindex', 'class', 'attributes'],
    type: "link",
    /**
     * define where this datatype is allowed
     */
    allowIn: {
        object: true,
        objectbrick: true,
        fieldcollection: true,
        localizedfield: true,
        classificationstore : false,
        block: true
    },

    initialize: function (treeNode, initData) {
        this.type = "link";

        this.initData(initData);

        // overwrite default settings
        this.availableSettingsFields = ["name","title","tooltip","noteditable","invisible","visibleGridView",
                                        "visibleSearch","style"];

        this.treeNode = treeNode;
    },

    getTypeName: function () {
        return t("link");
    },

    getIconClass: function () {
        return "opendxp_icon_link";
    },
    getLayout: function ($super) {
        $super();

        this.specificPanel.add([
            {
                xtype: "multiselect",
                fieldLabel: t("allowed_types") + '<br />' + t('allowed_types_hint'),
                name: "allowedTypes",
                id: 'allowedTypes',
                store: this.types,
                value: this.datax.allowedTypes,
                displayField: "text",
                valueField: "text",
                width: 400
            },
            {
                xtype: "multiselect",
                fieldLabel: t("allowed_targets") + '<br />' + t('allowed_types_hint'),
                name: "allowedTargets",
                id: 'allowedTargets',
                store: this.targets,
                value: this.datax.allowedTargets,
                displayField: "text",
                valueField: "text",
                width: 400
            },
            {
                xtype: "multiselect",
                fieldLabel: t("disabled_fields") + '<br />' + t('allowed_types_hint'),
                name: "disabledFields",
                id: 'disabledFields',
                store: this.fields,
                value: this.datax.disabledFields,
                displayField: "text",
                valueField: "text",
                width: 400
            }
        ]);

        return this.layout;
    }
});
