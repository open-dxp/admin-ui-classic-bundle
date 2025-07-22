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

opendxp.registerNS('opendxp.document.editables.snippet');
/**
 * @private
 */
opendxp.document.editables.snippet = Class.create(opendxp.document.editable, {

    defaultHeight: 100,

    initialize: function($super, id, name, config, data, inherited) {
        $super(id, name, config, data, inherited);

        this.data = data ?? {};

        // height management
        if (this.config.defaultHeight) {
            this.defaultHeight = this.config.defaultHeight;
        }

        if (this.config.height){
            this.initalHeightSet = true;
        } else {
            this.initalHeightSet = false;
            this.config.height = this.data.path ? 'auto' : this.defaultHeight;
        }

        this.config.name = id + '_editable';
        this.config.border = false;
        this.config.bodyStyle = 'min-height: 40px;';
    },

    render: function () {
        this.setupWrapper();

        this.element = new Ext.Panel(this.config);

        this.element.on('render', function (el) {
            try {
                if (typeof dndManager != 'undefined') {
                    dndManager.addDropTarget(el.getEl(), this.onNodeOver.bind(this), this.onNodeDrop.bind(this));
                }

                var body = this.getBody();
                var style = {
                    overflow: 'auto',
                };
                body.setStyle(style);
                body.getFirstChild().setStyle(style);
                body.insertHtml('beforeEnd', '<div class="opendxp_editable_droptarget"></div>');
                body.addCls('opendxp_editable_snippet_empty');

                el.getEl().on('contextmenu', this.onContextMenu.bind(this));
            } catch (e) {
                console.log(e);
            }
        }.bind(this));

        this.element.render(this.id);

        if (this.data.path) {
            this.updateContent(this.data.path);
        }
    },

    onNodeDrop: function (target, dd, e, data) {
        if(!opendxp.helpers.dragAndDropValidateSingleItem(data)) {
            return false;
        }

        data = data.records[0].data;

        if (this.dndAllowed(data)) {
            // get path from nodes data
            var uri = data.path;

            this.data.id = data.id;
            this.data.path = uri;

            if (this.config.reload) {
                this.reloadDocument();
            } else {
                this.updateContent(uri);
            }

            return true;
        }
    },

    onNodeOver: function(target, dd, e, data) {
        if (data.records.length === 1 && this.dndAllowed(data.records[0].data)) {
            return Ext.dd.DropZone.prototype.dropAllowed;
        }
        else {
            return Ext.dd.DropZone.prototype.dropNotAllowed;
        }
    },

    dndAllowed: function(data) {
        return data.type === 'snippet';
    },

    getBody: function () {
        // get the id from the body element of the panel because there is no method to set body's html
        // (only in configure)
        var bodyId = Ext.get(this.element.getEl().dom).query('.' + Ext.baseCSSPrefix + 'panel-body')[0].getAttribute('id');
        return Ext.get(bodyId);
    },

    updateContent: function (path) {
        var params = this.config;
        params.opendxp_admin = true;

        Ext.Ajax.request({
            method: 'get',
            url: path,
            success: function (response) {
                var body = this.getBody();
                body.getFirstChild().dom.innerHTML = response.responseText;
                this.updateDimensions();
            }.bind(this),
            params: params
        });
    },

    updateDimensions: function () {
        var body = this.getBody();
        var parent = body.getParent();

        this.element.getEl().setStyle('height', 'auto');
        body.setStyle('height', 'auto');

        if (this.initalHeightSet) {
            parent.setStyle({
                height: this.config.height + 'px',
                overflowY: 'auto',
            });
        }
        else {
            parent.setStyle({
                height: this.data.path ? 'auto' : this.defaultHeight + 'px',
                overflowY: 'hidden',
            });
        }

        if(this.data.path){
            body.removeCls('opendxp_editable_snippet_empty');
        }
        else{
            body.setStyle('height', '100%');
        }
    },

    onContextMenu: function (e) {
        var menu = new Ext.menu.Menu();

        if(this.data['id']) {
            menu.add(new Ext.menu.Item({
                text: t('empty'),
                iconCls: 'opendxp_icon_delete',
                handler: function (item) {
                    item.parentMenu.destroy();
                    this.data = {};
                    var body = this.getBody();
                    body.getFirstChild().dom.innerHTML = '';
                    body.addCls('opendxp_editable_snippet_empty');

                    if (this.config.reload) {
                        this.reloadDocument();
                    }

                    this.updateDimensions();
                }.bind(this)
            }));

            menu.add(new Ext.menu.Item({
                text: t('open'),
                iconCls: 'opendxp_icon_open',
                handler: function (item) {
                    item.parentMenu.destroy();
                    opendxp.helpers.openDocument(this.data.id, 'snippet');
                }.bind(this)
            }));

            if (opendxp.elementservice.showLocateInTreeButton('document')) {
                menu.add(new Ext.menu.Item({
                    text: t('show_in_tree'),
                    iconCls: 'opendxp_icon_show_in_tree',
                    handler: function (item) {
                        item.parentMenu.destroy();
                        opendxp.treenodelocator.showInTree(this.data.id, 'document');
                    }.bind(this)
                }));
            }
        }

        if(opendxp.helpers.hasSearchImplementation()) {
            menu.add(new Ext.menu.Item({
                text: t('search'),
                iconCls: 'opendxp_icon_search',
                handler: function (item) {
                    item.parentMenu.destroy();
                    this.openSearchEditor();
                }.bind(this)
            }));
        }

        menu.showAt(e.getXY());

        e.stopEvent();
    },

    openSearchEditor: function () {
        opendxp.helpers.itemselector(
            false,
            this.addDataFromSelector.bind(this),
            {
                type: ['document'],
                subtype: {
                    document: ['snippet'],
                },
            },
            {
                context: this.getContext(),
            }
        );
    },

    addDataFromSelector: function (item) {
        if(item) {
            var uri = item.fullpath;

            this.data.id = item.id;
            this.data.path = uri;

            if (this.config.reload) {
                this.reloadDocument();
            } else {
                this.updateContent(uri);
            }
        }
    },

    getValue: function () {
        return this.data.id;
    },

    getType: function () {
        return 'snippet';
    }
});