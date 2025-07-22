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

/**
 * @private
 * Adding a priority sorting function for menus
 */
Ext.define('opendxp.menu.menu', {
    extend: 'Ext.menu.Menu',

    initComponent: function() {

        let me = this;
        let items = me.items;

        if(items) {
            me.items = Ext.Array.sort(items, opendxp.helpers.priorityCompare);
        }

        me.callParent();
    }
});

