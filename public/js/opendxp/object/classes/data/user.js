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

opendxp.registerNS("opendxp.object.classes.data.user");
/**
 * @private
 */
opendxp.object.classes.data.user = Class.create(opendxp.object.classes.data.data, {

    type: "user",
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
        this.type = "user";

        this.initData(initData);

        this.treeNode = treeNode;
    },

    getTypeName: function () {
        return t("user");
    },

    getGroup: function () {
        return "select";
    },

    getIconClass: function () {
        return "opendxp_icon_user";
    },

    getLayout: function ($super) {

        $super();

        this.specificPanel.removeAll();
        return this.layout;
    },
    
    applySpecialData: function(source) {
        if (source.datax) {
            if (!this.datax) {
                this.datax =  {};
            }
            Ext.apply(this.datax,
                {
                    unique: source.datax.unique
                });
        }
    },

    supportsUnique: function() {
        return true;
    }

});
