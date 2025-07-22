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

opendxp.registerNS('opendxp.object.helpers.reservedWords');

opendxp.object.helpers.reservedWords = {
    // https://www.php.net/manual/en/reserved.keywords.php
    phpReservedKeywords: [
        'abstract', 'and', 'array', 'as', 'break', 'callable', 'case', 'catch', 'class', 'clone', 'const', 'continue',
        'declare', 'default', 'die', 'do', 'echo', 'else', 'elseif', 'empty', 'enddeclare', 'endfor', 'endforeach',
        'endif', 'endswitch', 'endwhile', 'eval', 'exit', 'extends', 'final', 'finally', 'fn', 'for', 'foreach',
        'function', 'global', 'goto', 'if', 'implements', 'include', 'include_once', 'instanceof', 'insteadof',
        'interface', 'isset', 'list', 'match', 'namespace', 'new', 'or', 'print', 'private', 'protected', 'public',
        'readonly', 'require', 'require_once', 'return', 'static', 'switch', 'throw', 'trait', 'try', 'unset', 'use',
        'var', 'while', 'xor', 'yield', 'yield_from'
    ],

    // https://www.php.net/manual/en/reserved.classes.php
    phpReservedClasses: [
        'self', 'static', 'parent'
    ],

    // https://www.php.net/manual/en/reserved.other-reserved-words.php
    phpOtherReservedWords: [
        'int', 'float', 'bool', 'string', 'true', 'false', 'null', 'void', 'iterable', 'object', 'mixed', 'never',
        'enum', 'resource', 'numeric'
    ],

    opendxp: [
        // OpenDXP
        'data', 'folder', 'permissions', 'dao', 'concrete', 'items'
    ],

    isReservedWord: function (word) {
        return in_arrayi(word, this.getAllReservedWords());
    },

    getAllReservedWords: function () {
        return this.phpReservedKeywords.concat(
            this.phpReservedClasses,
            this.phpOtherReservedWords,
            this.opendxp
        );
    }
};