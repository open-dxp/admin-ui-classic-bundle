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

opendxp.registerNS("opendxp.document.snippets.settings");
/**
 * @private
 */
opendxp.document.snippets.settings = Class.create(opendxp.document.settings_abstract, {

    getLayout: function () {

        if (this.layout == null) {

            this.layout = new Ext.FormPanel({
                title: t('settings'),
                border: false,
                autoScroll: true,
                bodyStyle:'padding:0 10px 0 10px;',
                iconCls: "opendxp_material_icon_settings opendxp_material_icon",
                items: [
                    this.getControllerViewFields(),
                    this.getPathAndKeyFields(),
                    this.getContentMainFields()
                ]
            });
        }

        return this.layout;
    }

});
