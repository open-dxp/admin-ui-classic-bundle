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
 *
 * some global helper functions
 */
opendxp.registerNS("opendxp.helpers.quantityValue.x");

opendxp.helpers.quantityValue.storeLoaded = false;
opendxp.helpers.quantityValue.store = null;

opendxp.helpers.quantityValue.initUnitStore = function(callback, filters, data) {
    if (data && data.unit && opendxp.helpers.quantityValue.storeLoaded) {
        let rec = opendxp.helpers.quantityValue.store.getById(data.unit);
        if (rec == null) {
            opendxp.helpers.quantityValue.storeLoaded = false;
            opendxp.helpers.quantityValue.store = null;
        }
    }


    if (!opendxp.helpers.quantityValue.storeLoaded) {
        var newListener = function () {
            opendxp.helpers.quantityValue.storeLoaded = true;
            opendxp.helpers.quantityValue.storeLoading = false;
            opendxp.helpers.quantityValue.getData(callback, filters);
        }.bind(this);

        if (!opendxp.helpers.quantityValue.store) {
            opendxp.helpers.quantityValue.store = new Ext.data.JsonStore({
                autoLoad: true,
                proxy: {
                    type: 'ajax',
                    url: Routing.generate('opendxp_admin_dataobject_quantityvalue_unitlist'),
                    reader: {
                        type: 'json',
                        rootProperty: 'data'
                    },
                    writer: {
                        type: 'json'
                    }
                },
                fields: ['id', 'abbreviation'],
                listeners: {
                    load: newListener
                }
            });
        } else {
            opendxp.helpers.quantityValue.store.addListener("load", newListener);
        }

    } else {
        opendxp.helpers.quantityValue.getData(callback, filters);
    }

}

opendxp.helpers.quantityValue.getData = function(callback, filterArray) {
    if(callback) {
        opendxp.helpers.quantityValue.store.clearFilter();
        //var filterArray = filters.split(',');

        var data = [];
        if (filterArray) {
            for (var i = 0; i < filterArray.length; i++) {
                var rec = opendxp.helpers.quantityValue.store.getById(filterArray[i]);
                if (rec) {
                    data.push(rec.data);
                }
            }
        }
        callback({data: data});
    }
}

opendxp.helpers.quantityValue.classDefinitionStore = null;
opendxp.helpers.quantityValue.getClassDefinitionStore = function() {
    if(!opendxp.helpers.quantityValue.classDefinitionStore) {
        opendxp.helpers.quantityValue.classDefinitionStore = new Ext.data.JsonStore({
            //autoDestroy: true,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: Routing.generate('opendxp_admin_dataobject_quantityvalue_unitlist'),
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            },
            fields: ['id', 'abbreviation']
        });
    }
    return opendxp.helpers.quantityValue.classDefinitionStore;
}
