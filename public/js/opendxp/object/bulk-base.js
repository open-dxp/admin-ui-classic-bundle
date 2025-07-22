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

opendxp.registerNS("opendxp.object.bulkbase");
/**
 * @private
 */
opendxp.object.bulkbase = Class.create({

    getTypeRenderer: function (value, metaData, record, rowIndex, colIndex, store) {
        return '<div class="opendxp_icon_' + value + '" style="min-height: 16px;" name="' + record.data.name + '">&nbsp;</div>';
    },

    getPrio: function(data) {
        switch (data.type) {
            case "fieldcollection":
                return 0;
            case "class":
                return 1;
            case "customlayout":
                return 2;
            case "objectbrick":
                return 3;
        }
        return 0;
    },

    selectAll: function(value) {
        var store = this.gridPanel.getStore();
        var records = store.getRange();
        for (var i = 0; i < records.length; i++) {
            var currentData = records[i];
            currentData.set("checked", value);
        }
    },

    sortValues: function() {
        this.values.sort(function(data1, data2){
            var value1 = this.getPrio(data1);
            var value2 = this.getPrio(data2);

            if (value1 > value2) {
                return 1;
            } else if (value1 < value2) {
                return -1;
            } else {
                return 0;
            }
        }.bind(this));
    }
});