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

opendxp.registerNS("opendxp.document.editables.embed");
/**
 * @private
 */
opendxp.document.editables.embed = Class.create(opendxp.document.editable, {

    initialize: function($super, id, name, config, data, inherited) {
        $super(id, name, config, data, inherited);

        this.data = data;
    },

    render: function () {
        this.setupWrapper();

        this.element = Ext.get(this.id);

        let button = new Ext.Button({
            iconCls: "opendxp_icon_embed opendxp_icon_overlay_edit",
            cls: "opendxp_edit_link_button",
            handler: this.openEditor.bind(this)
        });
        button.render(this.element.insertHtml("afterBegin", '<div class="opendxp_video_edit_button"></div>'));

        if(empty(this.data["url"])) {
            this.element.addCls("opendxp_editable_embed_empty");
            this.element.on("click", this.openEditor.bind(this));
        }
    },

    openEditor: function () {

        // disable the global dnd handler in this editmode/frame
        window.dndManager.disable();

        parent.Ext.MessageBox.prompt("", 'URL (eg. https://www.youtube.com/watch?v=nPntDiARQYw)',
        function (button, value, object) {
            if(button == "ok") {
                this.data["url"] = value;
                this.reloadDocument();
            }
        }.bind(this), this, false, this.data["url"]);
    },

    getValue: function () {
        return this.data;
    },

    getType: function () {
        return "embed";
    }
});