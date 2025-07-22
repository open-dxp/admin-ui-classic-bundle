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

opendxp.registerNS("opendxp.element.gridexport.abstract");
/**
 * @private
 */
opendxp.element.gridexport.abstract = Class.create({
    name: t('export'),
    text: t('export'),
    warningText: t('asset_export_warning'),

    getExportSettingsContainer: function () {
        return null;
    },
    getObjectSettingsContainer: function () {
        return null;
    },
});

opendxp.globalmanager.add("opendxp.asset.gridexport", []);
opendxp.globalmanager.add("opendxp.object.gridexport", []);
