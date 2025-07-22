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

opendxp.registerNS("opendxp.object.layout.iframe");
/**
 * @private
 */
opendxp.object.layout.iframe = Class.create(opendxp.object.abstract, {

    initialize: function (config, context) {
        this.config = config;
        this.context = context;
        this.context["renderingData"] = this.config.renderingData;
        this.context["name"] = this.config.name;
    },

    getLayout: function () {

        var queryString = Ext.Object.toQueryString({
            context: Ext.encode(this.context)
        });
        var html = '<iframe src="' + this.config.iframeUrl + "?" + queryString + '"frameborder="0" width="100%" height="' + (this.config.height - 38) + '" style="display: block"></iframe>';

        this.component = new Ext.Panel({
            border: true,
            style: "margin-bottom: 10px",
            cls: "opendxp_layout_iframe_border",
            height: this.config.height,
            width: this.config.width,
            scrollable: true,
            html: html,
            tbar: {
                items: [
                    {
                        xtype: "tbtext",
                        text: this.config.title
                    }, "->",
                    {
                        xtype: 'button',
                        text: t('refresh'),
                        iconCls: 'opendxp_icon_reload',
                        handler: function () {
                            var key = "object_" + this.context.objectId;

                            if (opendxp.globalmanager.exists(key)) {
                                var objectTab = opendxp.globalmanager.get(key);
                                objectTab.saveToSession(function () {
                                    this.component.setHtml(html);
                                }.bind(this));


                            }


                        }.bind(this)
                    }
                ]
            }
        });
        return this.component;

    }
});
