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


opendxp.registerNS("opendxp.object.gridcolumn.operator.propertygetter");
/**
 * @private
 */
opendxp.object.gridcolumn.operator.propertygetter = Class.create(opendxp.object.gridcolumn.Abstract, {
        operatorGroup: "extractor",
        type: "operator",
        class: "PropertyGetter",
        iconCls: "opendxp_icon_properties",
        defaultText: "Property Getter",
        group: "getter",

        getConfigTreeNode: function (configAttributes) {
            if (configAttributes) {
                var nodeLabel = this.getNodeLabel(configAttributes);
                var node = {
                    draggable: true,
                    iconCls: this.iconCls,
                    text: nodeLabel,
                    configAttributes: configAttributes,
                    isTarget: true,
                    maxChildCount: 1,
                    expanded: false,
                    leaf: true,
                    expandable: false
                };
            } else {

                //For building up operator list
                var configAttributes = {type: this.type, class: this.class, label: this.getDefaultText()};

                var node = {
                    draggable: true,
                    iconCls: this.iconCls,
                    text: this.getDefaultText(),
                    configAttributes: configAttributes,
                    isTarget: true,
                    maxChildCount: 1,
                    leaf: true
                };
            }
            node.isOperator = true;
            return node;
        },


        getCopyNode: function (source) {
            var copy = source.createNode({
                iconCls: this.iconCls,
                text: source.data.cssClass,
                isTarget: true,
                leaf: true,
                maxChildCount: 1,
                expanded: false,
                isOperator: true,
                configAttributes: {
                    label: source.data.configAttributes.label,
                    type: this.type,
                    class: this.class
                }
            });
            return copy;
        },


        getConfigDialog: function (node, params) {
            this.node = node;

            this.label = new Ext.form.TextField({
                fieldLabel: t('label'),
                length: 255,
                width: 200,
                value: this.node.data.configAttributes.label,
                renderer: Ext.util.Format.htmlEncode
            });

            this.propertyNameField = new Ext.form.TextField({
                fieldLabel: t('property_name'),
                length: 255,
                width: 200,
                value: this.node.data.configAttributes.propertyName,
                renderer: Ext.util.Format.htmlEncode
            });

            this.configPanel = new Ext.Panel({
                layout: "form",
                bodyStyle: "padding: 10px;",
                items: [this.label, this.propertyNameField],
                buttons: [{
                    text: t("apply"),
                    iconCls: "opendxp_icon_apply",
                    handler: function () {
                        this.commitData(params);
                    }.bind(this)
                }]
            });

            this.window = new Ext.Window({
                width: 400,
                height: 450,
                modal: true,
                title: t('settings'),
                layout: "fit",
                items: [this.configPanel]
            });

            this.window.show();
            return this.window;
        },

        commitData: function (params) {
            this.node.set('isOperator', true);
            this.node.data.configAttributes.propertyName = this.propertyNameField.getValue();
            this.node.data.configAttributes.label = this.label.getValue();

            var nodeLabel = this.getNodeLabel(this.node.data.configAttributes);
            this.node.set('text', nodeLabel);
            this.window.close();
            if (params && params.callback) {
                params.callback();
            }
        },

        getNodeLabel: function (configAttributes) {
            var nodeLabel = configAttributes.label ? configAttributes.label : this.getDefaultText();
            if (configAttributes.attribute) {
                var attr = configAttributes.attribute;
                if (configAttributes.param1) {
                    attr += " " + configAttributes.param1;
                }
                nodeLabel += '<span class="opendxp_gridnode_hint"> (' + attr + ')</span>';
            }

            return nodeLabel;

        }
    }
);
