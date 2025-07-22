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

namespace OpenDxp\Bundle\AdminBundle\DataObject\GridColumnConfig\Operator\Factory;

use OpenDxp\Bundle\AdminBundle\DataObject\GridColumnConfig\Operator\OperatorInterface;
use OpenDxp\Bundle\AdminBundle\DataObject\GridColumnConfig\Operator\TranslateValue;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * @internal
 */
final class TranslateValueFactory implements OperatorFactoryInterface
{
    private TranslatorInterface $translator;

    public function __construct(TranslatorInterface $translator)
    {
        $this->translator = $translator;
    }

    public function build(\stdClass $configElement, array $context = []): OperatorInterface
    {
        return new TranslateValue($this->translator, $configElement, $context);
    }
}
