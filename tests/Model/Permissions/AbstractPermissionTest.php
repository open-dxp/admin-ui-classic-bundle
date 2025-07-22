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

namespace OpenDxp\Bundle\AdminBundle\Tests\Model\Controller;

use Codeception\Stub;
use OpenDxp\Bundle\AdminBundle\Service\ElementService;
use OpenDxp\Config;
use OpenDxp\Model\User;
use OpenDxp\Security\User\UserLoader;
use OpenDxp\Tests\Support\Helper\OpenDxp;
use OpenDxp\Tests\Support\Test\ModelTestCase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

abstract class AbstractPermissionTest extends ModelTestCase
{
    protected function buildController(string $classname, User $user): mixed
    {
        $openDxpModule = $this->getModule('\\'.OpenDxp::class);
        $config = $openDxpModule->grabService(Config::class);
        $elementService = Stub::construct(
            ElementService::class,
            [
                Stub::makeEmpty(UrlGeneratorInterface::class),
                $config,
                Stub::makeEmpty(UserLoader::class, [
                    'getUser' => function () use ($user) {
                        return $user;
                    },
                ]),
            ]
        );

        return Stub::construct($classname, [$elementService], [
            'getAdminUser' => function () use ($user) {
                return $user;
            },
            'getOpenDxpUser' => function () use ($user) {
                return $user;
            },
            'adminJson' => function ($data) {
                return new JsonResponse($data);
            },
            'getThumbnailUrl' => function ($asset) {
                return '';
            },
        ]);
    }

    abstract public function testTreeGetChildrenById(): void;
}
