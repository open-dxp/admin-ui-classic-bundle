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

if (!opendxp) {
    var opendxp = {};
}


opendxp.registerNS = function(namespace) {
    var spaces = namespace.split(".");

    // create main space
    if (typeof window[spaces[0]] != "object") {
        window[spaces[0]] = {};
    }
    var currentLevel = window[spaces[0]];

    // create all subspaces
    for (var i = 1; i < (spaces.length - 1); i++) {
        if (typeof currentLevel[spaces[i]] != "object") {
            currentLevel[spaces[i]] = {};
        }
        currentLevel = currentLevel[spaces[i]];
    }
    return currentLevel;
};



opendxp.registerNS("opendxp.globalmanager");
opendxp.globalmanager = {
    store: {},

    add: function (key, value) {
        this.store[key] = value;
    },

    remove: function (key) {
        try {
            if (this.store[key]) {
                delete this.store[key];
            }
        }
        catch (e) {
            console.log("failed to remove " + key + " from cache");
        }

    },

    exists: function (key) {
        if (this.store[key]) {
            return true;
        }
        return false;
    },

    get: function (key) {
        if (this.store[key]) {
            return this.store[key];
        }
        return false;
    }
};

