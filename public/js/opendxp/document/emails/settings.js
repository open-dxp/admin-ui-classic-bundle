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

opendxp.registerNS("opendxp.document.emails.settings");
/**
 * @private
 */
opendxp.document.emails.settings = Class.create(opendxp.document.settings_abstract, {

    getLayout: function () {

        if (this.layout == null) {

            this.layout = Ext.create('Ext.form.Panel', {

                title: t('settings'),
                bodyStyle:'padding:0 10px 0 10px;',
                border: false,
                autoScroll: true,
                iconCls: "opendxp_material_icon_settings opendxp_material_icon",
                items: [
                    {
                        xtype:'fieldset',
                        title: t('email_settings'),
                        collapsible: true,
                        autoHeight:true,
                        labelWidth: 200,
                        defaultType: 'textfield',
                        defaults: {width: 700},
                        items :[
                            {
                                fieldLabel: t('email_subject'),
                                name: 'subject',
                                value: this.document.data.subject
                            },
                            {
                                fieldLabel: t('email_from'),
                                name: 'from',
                                value: this.document.data.from
                            },
                            {
                                fieldLabel: t('email_reply_to'),
                                name: 'replyTo',
                                value: this.document.data.replyTo
                            },
                            {
                                fieldLabel: t('email_to'),
                                name: 'to',
                                value: this.document.data.to
                            },
                            {
                                fieldLabel: t('email_cc'),
                                name: 'cc',
                                value: this.document.data.cc
                            },
                            {
                                fieldLabel: t('email_bcc'),
                                name: 'bcc',
                                value: this.document.data.bcc
                            },
                            {
                                xtype: "displayfield",
                                value: t("email_settings_receiver_description"),
                                style: "font-size: 10px;"
                            }
                        ]
                    },
                    this.getControllerViewFields(),
                    this.getPathAndKeyFields()
                ]
            });
        }

        return this.layout;
    }

});
