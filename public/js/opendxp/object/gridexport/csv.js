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

opendxp.registerNS("opendxp.object.gridexport.csv");
/**
 * @private
 */
opendxp.object.gridexport.csv = Class.create(opendxp.element.gridexport.abstract, {
    name: "csv",
    text: t("export_csv"),
    warningText: t('csv_object_export_warning'),

    getDownloadUrl: function (fileHandle) {
        return Routing.generate('opendxp_admin_dataobject_dataobjecthelper_downloadcsvfile', { fileHandle: fileHandle });
    },

    getObjectSettingsContainer: function () {
        var enableInheritance = new Ext.form.Checkbox({
            fieldLabel: t('enable_inheritance'),
            name: 'enableInheritance',
            value: true,
            inputValue: true,
            labelWidth: 200
        });

        return new Ext.form.FieldSet({
            title: t('object_settings'),
            items: [
                enableInheritance
            ]
        });
    },
    getExportSettingsContainer: function () {
        return new Ext.form.FieldSet({
            title: t('csv_settings'),
            items: [
                new Ext.form.TextField({
                    fieldLabel: t('delimiter'),
                    name: 'delimiter',
                    maxLength: 1,
                    labelWidth: 200,
                    value: ';'
                }),
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

opendxp.globalmanager.get("opendxp.object.gridexport").push(new opendxp.object.gridexport.csv());
