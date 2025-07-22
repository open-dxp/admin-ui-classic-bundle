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

opendxp.registerNS('opendxp.object.classes.data.dateRange');
/**
 * @private
 */
opendxp.object.classes.data.dateRange = Class.create(opendxp.object.classes.data.data, {
    type: 'dateRange',

    /**
     * define where this datatype is allowed
     */
    allowIn: {
        object: true,
        objectbrick: true,
        fieldcollection: true,
        localizedfield: true,
        classificationstore : false,
        block: true,
        encryptedField: true,
    },

    initialize: function (treeNode, initData) {
        this.type = 'dateRange';
        this.initData(initData);
        this.treeNode = treeNode;
    },

    getTypeName: function () {
        return t('date_range');
    },

    getGroup: function () {
        return 'date';
    },

    getIconClass: function () {
        return 'opendxp_icon_dateRange';
    },

    getLayout: function ($super) {
        $super();

        this.specificPanel.removeAll();
        const specificItems = this.getSpecificPanelItems(this.datax);
        this.specificPanel.add(specificItems);

        return this.layout;
    },

    getSpecificPanelItems: function (datax, inEncryptedField) {
        let specificItems = [
            {
                xtype: 'textfield',
                fieldLabel: t('width'),
                name: 'width',
                value: datax.width,
            },
            {
                xtype: 'displayfield',
                hideLabel: true,
                value: t('width_explanation'),
            },
        ];

        return specificItems;
    },

    applyData: function ($super) {
        $super();
        this.datax.queryColumnType = this.datax.columnType;
    },

    applySpecialData: function (source) {
        if (!source.datax) {
            return;
        }

        if (!this.datax) {
            this.datax =  {};
        }

        Ext.apply(this.datax, { width: source.datax.width });
    },
});
