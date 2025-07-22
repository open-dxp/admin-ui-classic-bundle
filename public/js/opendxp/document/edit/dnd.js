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

opendxp.registerNS("opendxp.document.edit.dnd");
/**
 * @private
 */
opendxp.document.edit.dnd = Class.create({

    dndManager: null,

    globalDropZone: null,

    initialize: function(parentExt, body, iframeElement) {

        parentExt.dd.DragDropMgr.notifyOccluded = true;
        this.dndManager = parentExt.dd.DragDropMgr;

        body.addListener('mousemove', this.ddMouseMove.bind(this));
        body.addListener('mouseup', this.ddMouseUp.bind(this));

        this.globalDropZone = new parent.Ext.dd.DropZone(iframeElement, {
            ddGroup: "element",
            validElements: [],

            getTargetFromEvent: function(e) {
                var element = null;
                var elLength = this.validElements.length;

                for (var i = 0; i < elLength; i++) {
                    element = this.validElements[i];
                    if (element["el"].dndOver) {
                        if(element["drop"]) {
                            this.onNodeDrop = element["drop"];
                        }
                        if(element["over"]) {
                            this.onNodeOver = element["over"];
                        }
                        return element["el"];
                    }
                }
            }
        });

        window.setInterval(this.setIframeOffset.bind(this),1000);
        this.setIframeOffset();
    },

    addDropTarget: function (el, overCallback, dropCallback) {

        el.on("mouseover", function (e) {
            this.dndOver = true;
        }.bind(el));
        el.on("mouseout", function (e) {
            this.dndOver = false;
        }.bind(el));

        el.dndOver = false;

        this.globalDropZone.validElements.push({
            el: el,
            over: overCallback,
            drop: dropCallback
        });
    },

    ddMouseMove: function (e) {
        if (this.dndManager.dragCurrent) {
            // update the xy of the event if necessary
            this.setDDPos(e);
            // *** Note that the 'this' scope is the drag drop manager
            this.dndManager.handleMouseMove(e);
        }
    },

    ddMouseUp : function (e) {
        if (this.dndManager.dragCurrent) {
            // update the xy of the event if necessary
            this.setDDPos(e);
            // *** Note that the 'this' scope is the drag drop manager
            this.dndManager.handleMouseUp(e);
        }
    },


    setDDPos: function (e) {

        var scrollTop = 0;
        var scrollLeft = 0;

        var doc = (window.contentDocument || window.document);
        scrollTop = doc.documentElement.scrollTop || doc.body.scrollTop;
        scrollLeft = doc.documentElement.scrollLeft || doc.body.scrollLeft;

        if (this.dndManager.dragCurrent) {
            e.xy = [e.pageX + this.iframeOffset[0] - scrollLeft, e.pageY + this.iframeOffset[1] - scrollTop];
        }
    },

    setIframeOffset: function () {
        try {
            this.iframeOffset = parent.Ext.get('document_iframe_'
            + window.editWindow.document.id).getOffsetsTo(parent.Ext.getBody());
        } catch (e) {
            console.log(e);
        }
    },

    disable: function () {
        this.globalDropZone.lock();
    },

    enable: function () {
        this.globalDropZone.unlock();
    }

});
