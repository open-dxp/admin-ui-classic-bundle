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
use OpenDxp\Bundle\AdminBundle\DataObject\GridColumnConfig\Operator\WorkflowState;
use OpenDxp\Workflow\Place\StatusInfo;

/**
 * @internal
 */
final class WorkflowStateFactory implements OperatorFactoryInterface
{
    private StatusInfo $workflowStatusInfo;

    public function __construct(StatusInfo $workflowStatusInfo)
    {
        $this->workflowStatusInfo = $workflowStatusInfo;
    }

    public function build(\stdClass $configElement, array $context = []): OperatorInterface
    {
        $operator = new WorkflowState($configElement, $context);
        $operator->setWorkflowStatusInfo($this->workflowStatusInfo);

        return $operator;
    }
}
