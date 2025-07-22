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

opendxp.registerNS("opendxp.object.tags.password");
/**
 * @private
 */
opendxp.object.tags.password = Class.create(opendxp.object.tags.abstract, {

    type: "password",

    initialize: function (data, fieldConfig) {

        if (data) {
            this.data = data;
        }
        this.fieldConfig = fieldConfig;

    },

    getLayoutEdit: function () {

        var input = {
            fieldLabel: this.fieldConfig.title,
            name: this.fieldConfig.name,
            componentCls: this.getWrapperClassNames(),
            inputType: "password",
            listeners: {
                afterrender: function (cmp) {
                    cmp.inputEl.set({
                        autocomplete: 'new-password'
                    });
                }
            }
        };

        input.value = "********";

        if (this.fieldConfig.width) {
            input.width = this.fieldConfig.width;
        } else {
            input.width = 350;
        }

        this.component = new Ext.form.TextField(input);

        return this.component;
    },


    getLayoutShow: function () {

        this.component = this.getLayoutEdit();
        this.component.disable();

        return this.component;
    },

    getValue: function () {
        if(this.component.isDirty()) {
            return this.component.getValue();
        }
        return this.data;
    },

    getName: function () {
        return this.fieldConfig.name;
    }
});
