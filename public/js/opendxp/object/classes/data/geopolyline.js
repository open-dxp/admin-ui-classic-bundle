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

opendxp.registerNS('opendxp.object.classes.data.geopolyline');
/**
 * @private
 */
opendxp.object.classes.data.geopolyline = Class.create(opendxp.object.classes.data.geo.abstract, {

    type: 'geopolyline',

    initialize: function (treeNode, initData) {
        this.type = 'geopolyline';

        this.initData(initData);

        // overwrite default settings
        this.availableSettingsFields = ['name','title','mandatory','noteditable','invisible','style'];

        this.treeNode = treeNode;
    },

    getTypeName: function () {
        return t('geopolyline');
    },

    getGroup: function () {
        return 'geo';
    },

    getIconClass: function () {
        return 'opendxp_icon_geopolyline';
    }

});
