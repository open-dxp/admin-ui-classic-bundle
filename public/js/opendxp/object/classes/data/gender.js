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

opendxp.registerNS("opendxp.object.classes.data.gender");
/**
 * @private
 */
opendxp.object.classes.data.gender = Class.create(opendxp.object.classes.data.data, {

    type: "gender",
    /**
     * define where this datatype is allowed
     */
    allowIn: {
        object: true,
        objectbrick: true,
        fieldcollection: true,
        localizedfield: false,
        classificationstore : false,
        block: true,
        encryptedField: true
    },

    initialize: function (treeNode, initData) {
        this.type = "gender";

        if(!initData["name"]) {
            initData = {
                title: t("gender")
            };
        }

        initData.fieldtype = "gender";
        initData.datatype = "data";
        initData.name = "gender";
        treeNode.set("text", "gender");

        this.initData(initData);

        this.treeNode = treeNode;
    },

    getTypeName: function () {
        return t("gender");
    },

    getGroup: function () {
        return "crm";
    },

    getIconClass: function () {
        return "opendxp_icon_gender";
    },

    getLayout: function ($super) {

        $super();

        let nameField = this.layout.getComponent("standardSettings").getComponent("name");
        nameField.disable();

        if(this.mandatoryCheckbox.checked != true) {
            this.mandatoryCheckbox.disable();
        }

        this.mandatoryCheckbox.on('change', function (checkbox) {
            if(checkbox.checked != true) {
                checkbox.disable();
            }
        });

        this.specificPanel.removeAll();
        return this.layout;
    }
});
