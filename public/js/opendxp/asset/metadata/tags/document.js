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

opendxp.registerNS("opendxp.asset.metadata.tags.document");
/**
 * @private
 */
opendxp.asset.metadata.tags.document = Class.create(opendxp.asset.metadata.tags.manyToOneRelation, {

    type: "document",
    dataChanged: false,
    dataObjectFolderAllowed: false,

    initialize: function (data, fieldConfig) {

        this.type = "document";
        this.data = null;

        if (data) {
            this.data = data;
        }
        this.fieldConfig = fieldConfig;
    }
});
