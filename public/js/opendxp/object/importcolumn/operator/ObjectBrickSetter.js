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

opendxp.registerNS("opendxp.object.importcolumn.operator.objectbricksetter");
/**
 * @private
 */
opendxp.object.importcolumn.operator.objectbricksetter = Class.create(opendxp.object.gridcolumn.Abstract, {
    type: "operator",
    class: "ObjectBrickSetter",
    iconCls: "opendxp_icon_objectbricks",
    defaultText: "ObjectBrick Setter",


    getConfigTreeNode: function(configAttributes) {
        if(configAttributes) {
            var nodeLabel = this.getNodeLabel(configAttributes);
            var node = {
                draggable: true,
                iconCls: this.iconCls,
                text: nodeLabel,
                configAttributes: configAttributes,
                isTarget: true,
                maxChildCount: 1,
                expanded: true,
                leaf: false,
                expandable: false,
                isChildAllowed: this.allowChild
            };
        } else {

            //For building up operator list
            var configAttributes = { type: this.type, class: this.class, label: this.getDefaultText()};

            var node = {
                draggable: true,
                iconCls: this.iconCls,
                text: this.getDefaultText(),
                configAttributes: configAttributes,
                isTarget: true,
                maxChildCount: 1,
                leaf: true,
                isChildAllowed: this.allowChild
            };
        }
        node.isOperator = true;
        return node;
    },


    getCopyNode: function(source) {
        var copy = source.createNode({
            iconCls: this.iconCls,
            text: source.data.cssClass,
            isTarget: true,
            leaf: false,
            maxChildCount: 1,
            expanded: true,
            expandable: false,
            isOperator: true,
            isChildAllowed: this.allowChild,
            configAttributes: {
                label: source.data.configAttributes.label,
                type: this.type,
                class: this.class
            }
        });
        return copy;
    },


    getConfigDialog: function(node) {
        this.node = node;

        this.textfield = new Ext.form.TextField({
            fieldLabel: t('label'),
            length: 255,
            width: 200,
            value: this.node.data.configAttributes.label
        });

        this.attributeField = new Ext.form.TextField({
            fieldLabel: t('attribute'),
            length: 255,
            width: 200,
            value: this.node.data.configAttributes.attr
        });

        this.brickTypeField = new Ext.form.TextField({
            fieldLabel: t('brick_type'),
            length: 255,
            width: 200,
            value: this.node.data.configAttributes.brickType
        });


        var mode = this.node.data.configAttributes.mode ? this.node.data.configAttributes.mode : "ifNotEmpty";

        this.modeField = new Ext.form.RadioGroup({
            xtype: 'radiogroup',
            fieldLabel: t('create'),
            border: true,
            columns: 1,
            vertical: true,
            items: [
                {boxLabel: t('never'), name: 'mode', inputValue: 'never', checked: mode == "never" },
                {boxLabel: t('if_not_empty'), name: 'mode', inputValue: 'ifNotEmpty', checked: mode == "ifNotEmpty"},
                {boxLabel: t('always'), name: 'mode', inputValue: 'always', checked: mode == "always"}
            ]
        });



        this.configPanel = new Ext.Panel({
            layout: "form",
            bodyStyle: "padding: 10px;",
            items: [this.textfield, this.attributeField, this.brickTypeField, this.modeField],
            buttons: [{
                text: t("apply"),
                iconCls: "opendxp_icon_apply",
                handler: function () {
                    this.commitData();
                }.bind(this)
            }]
        });

        this.window = new Ext.Window({
            width: 400,
            height: 450,
            modal: true,
            title: this.getDefaultText(),
            layout: "fit",
            items: [this.configPanel]
        });

        this.window.show();
        return this.window;
    },

    commitData: function() {
        this.node.data.configAttributes.label = this.textfield.getValue();
        this.node.data.configAttributes.attr = this.attributeField.getValue();
        this.node.data.configAttributes.brickType = this.brickTypeField.getValue();
        this.node.data.configAttributes.mode = this.modeField.getValue().mode;
        var nodeLabel = this.getNodeLabel(this.node.data.configAttributes);
        this.node.set('text', nodeLabel);


        this.node.set('isOperator', true);
        this.window.close();
    },

    allowChild: function (targetNode, dropNode) {
        if (targetNode.childNodes.length > 0) {
            return false;
        }
        return true;
    },

    getNodeLabel: function (configAttributes) {
        var nodeLabel = configAttributes.label ? configAttributes.label : this.getDefaultText();
        if (configAttributes.attr) {
            nodeLabel += '<span class="opendxp_gridnode_hint"> (' + configAttributes.attr  + "-" + configAttributes.brickType + ')</span>';
        }

        return nodeLabel;
    },
});
