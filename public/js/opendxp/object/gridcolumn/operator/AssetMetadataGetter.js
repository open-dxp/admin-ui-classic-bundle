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


opendxp.registerNS("opendxp.object.gridcolumn.operator.assetmetadatagetter");
/**
 * @private
 */
opendxp.object.gridcolumn.operator.assetmetadatagetter = Class.create(opendxp.object.gridcolumn.Abstract, {
    operatorGroup: "extractor",
    type: "operator",
    class: "AssetMetadataGetter",
    iconCls: "opendxp_icon_operator_assetmetadatagetter",
    defaultText: "Asset Metadata Getter",
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
                expanded: true,
                leaf: false,
                expandable: false
            };
        } else {

            //For building up operator list
            var configAttributes = {type: this.type, class: this.class};

            var node = {
                draggable: true,
                iconCls: this.iconCls,
                text: this.getDefaultText(),
                configAttributes: configAttributes,
                isTarget: true,
                leaf: true
            };
        }
        node.isOperator = true;
        return node;
    },


    getCopyNode: function (source) {
        var copy = source.createNode({
            iconCls: this.iconCls,
            text: source.data.text,
            isTarget: true,
            leaf: false,
            expandable: false,
            isOperator: true,
            configAttributes: {
                label: source.data.text,
                type: this.type,
                class: this.class
            }
        });

        return copy;
    },


    getConfigDialog: function (node, params) {
        this.node = node;

        this.textField = new Ext.form.TextField({
            fieldLabel: t('label'),
            length: 255,
            width: 200,
            value: this.node.data.configAttributes.label,
            renderer: Ext.util.Format.htmlEncode
        });

        var data = [];
        for (var i = 0; i < opendxp.settings.websiteLanguages.length; i++) {
            var language = opendxp.settings.websiteLanguages[i];
            data.push([language, t(opendxp.available_languages[language])]);
        }

        var store = new Ext.data.ArrayStore({
                fields: ["key", "value"],
                data: data
            }
        );

        this.metaField = new Ext.form.TextField({
            fieldLabel: t('metadata_field'),
            length: 255,
            width: 200,
            value: this.node.data.configAttributes.metaField,
            renderer: Ext.util.Format.htmlEncode
        });

        var options = {
            fieldLabel: t('locale'),
            triggerAction: "all",
            editable: true,
            selectOnFocus: true,
            queryMode: 'local',
            typeAhead: true,
            forceSelection: false,
            store: store,
            componentCls: "object_field",
            mode: "local",
            width: 200,
            padding: 10,
            displayField: "value",
            valueField: "key",
            value: this.node.data.configAttributes.locale
        };

        this.localeField = new Ext.form.ComboBox(options);


        this.configPanel = new Ext.Panel({
            layout: "form",
            bodyStyle: "padding: 10px;",
            items: [this.textField, this.metaField, this.localeField],
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
            height: 400,
            modal: true,
            title: t('settings'),
            layout: "fit",
            items: [this.configPanel]
        });

        this.window.show();
        return this.window;
    },

    commitData: function () {
        this.node.data.configAttributes.label = this.textField.getValue();
        this.node.data.configAttributes.locale = this.localeField.getValue();
        this.node.data.configAttributes.metaField = this.metaField.getValue();

        var nodeLabel = this.getNodeLabel(this.node.data.configAttributes);

        this.node.set('text', nodeLabel);
        this.node.set('isOperator', true);

        this.window.close();

        if (params && params.callback) {
            params.callback();
        }
    },

    getNodeLabel: function(configAttributes) {
        var nodeLabel = configAttributes.label;
        nodeLabel += '<span class="opendxp_gridnode_hint"> (' + configAttributes.metaField  + (configAttributes.locale ? "-" + configAttributes.locale : "") + ')</span>';

        return nodeLabel;
    }
});