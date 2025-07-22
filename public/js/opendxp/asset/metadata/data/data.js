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

opendxp.registerNS("opendxp.asset.metadata.data.data");
/**
 * @private
 */
opendxp.asset.metadata.data.data = Class.create({

    allowIn: {
        predefined: true,
        custom: true
    },

    getType: function () {
        return this.type;
    },

    getIconClass: function () {
        return "opendxp_icon_" + this.getType();
    },

    getTypeName: function () {
        return t(this.getType());
    }
});
