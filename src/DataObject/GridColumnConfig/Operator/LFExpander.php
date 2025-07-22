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

namespace OpenDxp\Bundle\AdminBundle\DataObject\GridColumnConfig\Operator;

use OpenDxp\Bundle\AdminBundle\DataObject\GridColumnConfig\ResultContainer;
use OpenDxp\Localization\LocaleServiceInterface;
use OpenDxp\Model\Element\ElementInterface;
use OpenDxp\Tool;

/**
 * @internal
 */
final class LFExpander extends AbstractOperator
{
    private LocaleServiceInterface $localeService;

    /**
     * @var string[]
     */
    private array $locales;

    private bool $asArray;

    public function __construct(LocaleServiceInterface $localeService, \stdClass $config, array $context = [])
    {
        parent::__construct($config, $context);

        $this->localeService = $localeService;

        $this->locales = $config->locales ?? [];
        $this->asArray = $config->asArray ?? false;
    }

    public function getLabeledValue(array|ElementInterface $element): ResultContainer|\stdClass|null
    {
        $children = $this->getChildren();
        if (isset($children[0])) {
            if ($this->getAsArray()) {
                $result = new ResultContainer();
                $result->label = $this->label;
                $resultValues = [];

                $currentLocale = $this->localeService->getLocale();

                $validLanguages = $this->getValidLanguages();
                foreach ($validLanguages as $validLanguage) {
                    $this->localeService->setLocale($validLanguage);

                    $childValue = $children[0]->getLabeledValue($element);
                    if ($childValue && $childValue->value) {
                        $resultValues[] = $childValue;
                    } else {
                        $resultValues[] = null;
                    }
                }

                $this->localeService->setLocale($currentLocale);

                $result->value = $resultValues;

                return $result;
            } else {
                $value = $children[0]->getLabeledValue($element);
            }

            return $value;
        }

        return null;
    }

    public function expandLocales(): bool
    {
        return true;
    }

    /**
     * @return string[]
     */
    public function getValidLanguages(): array
    {
        if ($this->locales) {
            $validLanguages = $this->locales;
        } else {
            $validLanguages = Tool::getValidLanguages();
        }

        return $validLanguages;
    }

    public function getAsArray(): bool
    {
        return $this->asArray;
    }

    public function setAsArray(bool $asArray): void
    {
        $this->asArray = $asArray;
    }
}
