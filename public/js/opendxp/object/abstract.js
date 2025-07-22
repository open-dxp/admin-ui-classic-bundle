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

opendxp.registerNS("opendxp.object.abstract");
/**
 * @private
 */
opendxp.object.abstract = Class.create(opendxp.element.abstract, {

    selectInTree: function (type, button) {

        if(type != "variant" || this.data.general.showVariants) {
            try {
                opendxp.treenodelocator.showInTree(this.id, "object", button)
            } catch (e) {
                console.log(e);
            }
        }
    }
});