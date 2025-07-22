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

namespace OpenDxp\Bundle\AdminBundle\GDPR\DataProvider;

use OpenDxp\DependencyInjection\CollectionServiceLocator;

/**
 * @internal
 */
class Manager
{
    private ?CollectionServiceLocator $services = null;

    private ?array $sortedServices = null;

    public function __construct(CollectionServiceLocator $services)
    {
        $this->services = $services;
    }

    /**
     * Returns registered services in sorted order
     *
     * @return DataProviderInterface[]
     */
    public function getServices(): array
    {
        if (null !== $this->sortedServices) {
            return $this->sortedServices;
        }

        $this->sortedServices = $this->services->all();

        usort($this->sortedServices, function (DataProviderInterface $left, DataProviderInterface $right): int {
            if ($left->getSortPriority() === $right->getSortPriority()) {
                return 0;
            }

            return ($left->getSortPriority() < $right->getSortPriority()) ? -1 : 1;
        });

        return $this->sortedServices;
    }
}
