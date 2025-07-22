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

namespace OpenDxp\Bundle\AdminBundle\Controller\Traits;

use OpenDxp\Bundle\AdminBundle\Controller\AdminAbstractController;
use OpenDxp\Model\Element\ElementInterface;
use OpenDxp\Model\Schedule\Task;
use Symfony\Component\HttpFoundation\Request;

/**
 * @internal
 */
trait ApplySchedulerDataTrait
{
    protected function applySchedulerDataToElement(Request $request, ElementInterface $element): void
    {
        /** @var AdminAbstractController $this */

        // scheduled tasks
        if ($request->get('scheduler')) {
            $tasks = [];
            $tasksData = $this->decodeJson($request->get('scheduler'));

            if (!empty($tasksData)) {
                foreach ($tasksData as $taskData) {
                    $taskData['userId'] = $this->getAdminUser()->getId();

                    $task = new Task($taskData);
                    $tasks[] = $task;
                }
            }

            if ($element->isAllowed('settings') && method_exists($element, 'setScheduledTasks')) {
                $element->setScheduledTasks($tasks);
            }
        }
    }
}
