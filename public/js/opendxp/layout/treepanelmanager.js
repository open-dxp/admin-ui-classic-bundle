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

/**
 * @private
 */
opendxp.registerNS("opendxp.layout.treepanelmanager");
opendxp.layout.treepanelmanager = {
    
    items: [],
    finished: [],
    callbacks: {},
    inital: true,
    onReadyCallback: [],

    /**
     * This method is called in the tree classes of the elements (document, asset, object, custom views, ...)
     */
    register: function (id) {
        this.items.push({
            id: id,
            processed: false
        });
    },

    /**
     * This method is called in /bundles/opendxpadmin/js/opendxp/startup.js
     */
    startup: function () {
        if(this.items.length < 1) {
            // fire opendxpReady because there is no treepanel
            this.onReady();
        }
    },

    /**
     * This method is called in the tree classes of the elements (document, asset, object, custom views, ...)
     */
    initPanel: function (id, callback) {

        this.finished.push(id);
        this.callbacks[id] = callback;
        
        for (var i=0; i<this.items.length; i++) {
            if(!this.items[i].processed) {
                if(in_array(this.items[i].id,this.finished)) {
                    this.items[i].processed = true;
                    this.callbacks[this.items[i].id]();
                } else {
                    return;
                }
            }
        }
        
        if(this.inital) {
            // all processed fire the opendxpReady event
            this.onReady();
        }
        
        this.inital = false;
    },

    onReady: function () {
        for (var i=0; i<this.onReadyCallback.length; i++) {
            if(typeof this.onReadyCallback[i] == "function") {
                this.onReadyCallback[i]();
            }
        }

        const openDxpReady = new CustomEvent(opendxp.events.opendxpReady, {
            detail: {
                viewport: opendxp.viewport,
            }
        });

        document.dispatchEvent(openDxpReady);
    },

    addOnReadyCallback: function (event) {
        this.onReadyCallback.push(event);
    },

    toLeft: function () {
        opendxp.layout.treepanelmanager.move(this.tree, Ext.getCmp("opendxp_panel_tree_right"),
                                                                        Ext.getCmp("opendxp_panel_tree_left"));
        this.tree.tools.left.hide();
        this.tree.tools.right.show();

        this.position = "left";
    },

    toRight: function () {
        opendxp.layout.treepanelmanager.move(this.tree, Ext.getCmp("opendxp_panel_tree_left"),
                                                                        Ext.getCmp("opendxp_panel_tree_right"));
        this.tree.tools.right.hide();
        this.tree.tools.left.show();

        this.position = "right";
    },

    move: function (tree, source, target) {
        if(target.hidden) {
            target.show();
            target.expand();
        }

        target.suspendLayouts();
        source.remove(tree, false);
        target.add(tree);
        tree.expand(false);
        target.resumeLayouts();

        if(source.items.getCount() < 1) {
            source.collapse();
            source.hide();
        }
        source.updateLayout();

        opendxp.layout.refresh();
    }
};
