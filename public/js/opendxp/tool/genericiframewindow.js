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

opendxp.registerNS("opendxp.tool.genericiframewindow");
/**
 * @private
 */
opendxp.tool.genericiframewindow = Class.create({

    initialize: function (id, src, iconCls, title) {

        this.id = id;
        this.src = src;
        this.iconCls = iconCls;
        this.title = title;

        this.getTabPanel();
    },

    activate: function () {
        var tabPanel = Ext.getCmp("opendxp_panel_tabs");
        tabPanel.setActiveItem("opendxp_iframe_" + this.id);
    },

    getTabPanel: function () {

        var toolbar = Ext.create('Ext.Toolbar', {
            cls: 'opendxp_main_toolbar',
            items: [{
                text: t("reload"),
                iconCls: "opendxp_icon_reload",
                handler: this.reload.bind(this)
            }, {
                text: t("open"),
                iconCls: "opendxp_icon_open",
                handler: function () {
                    window.open(Ext.get("opendxp_iframe_frame_" + this.id).dom.getAttribute("src"));
                }.bind(this)
            }]
        });

        if (!this.panel) {
            this.panel = new Ext.Panel({
                id: "opendxp_iframe_" + this.id,
                title: this.title,
                iconCls: this.iconCls,
                border: false,
                layout: "fit",
                closable:true,
                bodyCls: "opendxp_overflow_scrolling",
                html: '<iframe src="about:blank" frameborder="0" style="width:100%;" id="opendxp_iframe_frame_'
                                    + this.id + '"></iframe>',
                tbar: toolbar
            });

            this.panel.on("resize", this.setLayoutFrameDimensions.bind(this));
            this.panel.on("afterrender", this.reload.bind(this));

            var tabPanel = Ext.getCmp("opendxp_panel_tabs");
            tabPanel.add(this.panel);
            tabPanel.setActiveItem("opendxp_iframe_" + this.id);

            this.panel.on("destroy", function () {
                opendxp.globalmanager.remove(this.id);
            }.bind(this));

            opendxp.layout.refresh();
        }

        return this.panel;
    },

    setLayoutFrameDimensions: function (el, width, height, rWidth, rHeight) {
        Ext.get("opendxp_iframe_frame_" + this.id).setStyle({
            height: (height - 55) + "px"
        });
    },

    reload: function () {
        try {
            Ext.get("opendxp_iframe_frame_" + this.id).dom.src = this.src;
        }
        catch (e) {
            console.log(e);
        }
    }

});
