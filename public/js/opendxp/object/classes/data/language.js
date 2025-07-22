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

opendxp.registerNS("opendxp.object.classes.data.language");
/**
 * @private
 */
opendxp.object.classes.data.language = Class.create(opendxp.object.classes.data.data, {

    type: "language",
    /**
     * define where this datatype is allowed
     */
    allowIn: {
        object: true,
        objectbrick: true,
        fieldcollection: true,
        localizedfield: true,
        classificationstore : true,
        block: true,
        encryptedField: true
    },

    initialize: function (treeNode, initData) {
        this.type = "language";

        this.initData(initData);

        this.treeNode = treeNode;
    },

    getTypeName: function () {
        return t("language");
    },

    getGroup: function () {
        return "select";
    },

    getIconClass: function () {
        return "opendxp_icon_language";
    },

    getLayout: function ($super) {

        $super();

        this.specificPanel.removeAll();
        var specificItems = this.getSpecificPanelItems(this.datax, false);
        this.specificPanel.add(specificItems);

        return this.layout;
    },

    getSpecificPanelItems: function (datax, inEncryptedField) {
        if (this.isInCustomLayoutEditor()) {
            return [];
        }

        return[
            {
                xtype: "checkbox",
                labelStyle: "width: 350px",
                fieldLabel: t("only_configured_languages"),
                name: "onlySystemLanguages",
                checked: datax.onlySystemLanguages
            }
        ];

    },

    applySpecialData: function(source) {
    if (source.datax) {
        if (!this.datax) {
            this.datax =  {};
        }
        Ext.apply(this.datax,
            {
                onlySystemLanguages: source.datax.onlySystemLanguages
            });
    }
}
});
