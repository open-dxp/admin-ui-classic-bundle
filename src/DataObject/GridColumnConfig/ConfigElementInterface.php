<?php
declare(strict_types=1);

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

namespace OpenDxp\Bundle\AdminBundle\DataObject\GridColumnConfig;

use OpenDxp\Model\Element\ElementInterface;

interface ConfigElementInterface
{
    public function getLabel(): string;

    /**
     * @param ElementInterface|ElementInterface[] $element
     */
    public function getLabeledValue(array|ElementInterface $element): ResultContainer|\stdClass|null;

    public function getRenderer(): ?string;
}
