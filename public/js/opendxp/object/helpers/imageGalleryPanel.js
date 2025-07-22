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
Ext.define('opendxp.object.helpers.ImageGalleryPanel', {
    extend: 'Ext.panel.Panel',

    requires: [
        'opendxp.object.helpers.ImageGalleryDropZone'
    ],

    cls: 'x-portal',
    // bodyCls: 'x-portal-body',

    manageHeight: true,

    initComponent : function() {
        // Implement a Container beforeLayout call from the layout to this Container
        this.layout = {
            type : 'column'
        };
        this.callParent();
    },

    // private
    initEvents : function(){
        this.callParent();
        if (!this.proxyConfig.noteditable) {
            this.dd = Ext.create('opendxp.object.helpers.ImageGalleryDropZone', this, {}, this.proxyConfig);
        }
    },

    // private
    beforeDestroy : function() {
        if (this.dd) {
            this.dd.unreg();
        }
        this.callParent();
    }
});
