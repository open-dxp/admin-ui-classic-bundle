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

opendxp.registerNS("opendxp.element.helpers.gridTabAbstract");
/**
 * @private
 */
opendxp.element.helpers.gridTabAbstract = Class.create({

    considerChildTags: 0, // 0 => false

    getTagsPanel: function() {

        if(!this.tagsPanel) {

            var considerAllChildTags = Ext.create("Ext.form.Checkbox", {
                style: "margin-bottom: 0; margin-left: 5px",
                fieldStyle: "margin-top: 0",
                cls: "tag-tree-topbar",
                boxLabel: t("consider_child_tags"),
                listeners: {
                    change: function (field, checked) {
                        this.considerChildTags = checked === true ? 1 : 0;
                        this.store.getProxy().setExtraParam("considerChildTags", this.considerChildTags);
                        this.pagingtoolbar.moveFirst();
                    }.bind(this)
                }
            });


            if(!this.tagsTree) {
                this.tagsTree = new opendxp.element.tag.tree();
                this.tagsTree.setAllowAdd(false);
                this.tagsTree.setAllowDelete(false);
                this.tagsTree.setAllowDnD(false);
                this.tagsTree.setAllowRename(false);
                this.tagsTree.setShowSelection(true);
                this.tagsTree.setCheckChangeCallback(function(tagsTree) {
                    var tagIds = tagsTree.getCheckedTagIds();
                    this.store.getProxy().setExtraParam("tagIds[]", tagIds);
                    this.pagingtoolbar.moveFirst();
                }.bind(this, this.tagsTree));
            }

            this.tagsPanel = Ext.create("Ext.Panel", {
                region: "west",
                width: 300,
                collapsedCls: "tag-tree-toolbar-collapsed",
                resizable : true,
                collapsible: true,
                collapsed: true,
                autoScroll: true,
                items: [this.tagsTree.getLayout()],
                title: t('filter_tags'),
                tbar: [considerAllChildTags],
                iconCls: "opendxp_icon_element_tags"
            });
        }

        return this.tagsPanel;
    }
});
