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

opendxp.registerNS("opendxp.document.seemode");
/**
 * @private
 */
opendxp.document.seemode = Class.create({


    initialize: function(path) {
        this.windowInitialized = false;
        this.start();
    },

    start: function () {

        if (this.windowInitialized == false) {
            this.createWindow();
        }
        this.window.show();

        if (!path) {
            var path = this.determineCurrentPagePath();
        }

        this.setIframeSrc(path);
    },

    createWindow: function () {

        this.windowInitialized = true;

        this.window = new Ext.Window({
            layout:'fit',
            width:500,
            height:300,
            closeAction:'hide',
            plain: true,
            bodyCls: "opendxp_overflow_scrolling",
            html: '<iframe id="opendxp_seemode" name="opendxp_seemode" src="about:blank" frameborder="0" style="width: 100%;" '
                        + 'allowtransparency="false"></iframe>',
            maximized: true,
            buttons: [
                {
                    text: t("edit_current_page"),
                    iconCls: "opendxp_icon_edit",
                    handler: this.edit.bind(this)
                }
            ]
        });
        this.window.on("resize", this.setLayoutFrameDimensions.bind(this));

        opendxp.viewport.add(this.window);
    },

    setLayoutFrameDimensions: function (el, width, height, rWidth, rHeight) {

        Ext.get("opendxp_seemode").setStyle({
            height: (height-94) + "px",
            backgroundColor: "#fff"
        });
    },

    setIframeSrc: function (path) {
        var d = new Date();
        Ext.get("opendxp_seemode").dom.setAttribute("src", path + "?_time=" + d.getTime());
    },

    determineCurrentPagePath: function () {

        var tabPanel = Ext.getCmp("opendxp_panel_tabs");
        var activeTab = tabPanel.getActiveTab();

        if (activeTab) {
            // test if current tab is a document
            if (activeTab.initialConfig.document) {
                return activeTab.initialConfig.document.data.path + activeTab.initialConfig.document.data.key;
            }
        }
        return "/";
    },

    edit: function () {

        // get current location
        Ext.Ajax.request({
            url: Routing.generate('opendxp_admin_document_document_getidforpath'),
            params: {
                path: window["opendxp_seemode"].location.pathname
            },
            success: this.getIdForPathComplete.bind(this)
        });
    },

    getIdForPathComplete: function (response) {

        var r = Ext.decode(response.responseText);

        if (r) {
            if (r.id) {
                opendxp.helpers.openDocument(r.id, r.type);
            }
        }

        this.window.hide();
    }

});
