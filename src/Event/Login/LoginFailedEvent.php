<?php

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

namespace OpenDxp\Bundle\AdminBundle\Event\Login;

use OpenDxp\Model\User;
use Symfony\Contracts\EventDispatcher\Event;

class LoginFailedEvent extends Event
{
    protected array $credentials;

    protected ?User $user = null;

    public function __construct(array $credentials)
    {
        $this->credentials = $credentials;
    }

    public function getCredentials(): array
    {
        return $this->credentials;
    }

    public function getCredential(string $name, mixed $default = null): mixed
    {
        if (isset($this->credentials[$name])) {
            return $this->credentials[$name];
        }

        return $default;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    /**
     * @return $this
     */
    public function setUser(User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function hasUser(): bool
    {
        return null !== $this->user;
    }
}
