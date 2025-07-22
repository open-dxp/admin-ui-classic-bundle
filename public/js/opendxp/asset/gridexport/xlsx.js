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

opendxp.registerNS("opendxp.asset.gridexport.xlsx");
/**
 * @private
 */
opendxp.asset.gridexport.xlsx = Class.create(opendxp.element.gridexport.abstract, {
    name: "xlsx",
    text: t("export_xlsx"),
    warningText: t('asset_export_warning'),

    getDownloadUrl: function(fileHandle) {
         return Routing.generate('opendxp_admin_asset_assethelper_downloadxlsxfile', {fileHandle: fileHandle});
    },

    getExportSettingsContainer: function () {
        return new Ext.form.FieldSet({
            title: t('export_xlsx'),
            items: [
                new Ext.form.ComboBox({
                    fieldLabel: t('header'),
                    name: 'header',
                    store: [
                        ['name', t('system_key')],
                        ['title', t('label')],
                        ['no_header', t('no_header')]
                    ],
                    labelWidth: 200,
                    value: 'title',
                    forceSelection: true,
                })
            ]
        });
    }
});

opendxp.globalmanager.get("opendxp.asset.gridexport").push(new opendxp.asset.gridexport.xlsx());
