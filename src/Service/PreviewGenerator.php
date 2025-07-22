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

namespace OpenDxp\Bundle\AdminBundle\Service;

use OpenDxp\Model\DataObject\ClassDefinition\LinkGeneratorInterface;
use OpenDxp\Model\DataObject\ClassDefinition\PreviewGeneratorInterface;
use OpenDxp\Model\DataObject\Concrete;
use OpenDxp\Model\Site;
use OpenDxp\Model\Translation;
use OpenDxp\Tool;
use OpenDxp\Translation\Translator;
use Symfony\Contracts\Service\Attribute\Required;

class PreviewGenerator implements PreviewGeneratorInterface
{
    protected Translator $translator;

    public function generatePreviewUrl(Concrete $object, array $params): string
    {
        $linkGenerator = $object->getClass()->getLinkGenerator();

        if ($linkGenerator instanceof LinkGeneratorInterface) {
            $filteredParameters = $this->filterParameters($object, $params);

            $locale = $filteredParameters[PreviewGeneratorInterface::PARAMETER_LOCALE] ?? Tool::getDefaultLanguage();
            $site = array_key_exists(PreviewGeneratorInterface::PARAMETER_SITE, $filteredParameters) ? Site::getById($filteredParameters[PreviewGeneratorInterface::PARAMETER_SITE]) : (new Site\Listing())->current();

            return $linkGenerator->generate($object, [
                PreviewGeneratorInterface::PARAMETER_LOCALE => $locale,
                PreviewGeneratorInterface::PARAMETER_SITE => $site,
            ]);
        }

        throw new \LogicException("No link generator given for element of type {$object->getClassName()}");
    }

    /**
     * @return array only parameters that are part of the preview generator config and are not empty
     */
    protected function filterParameters(Concrete $object, array $parameters): array
    {
        $previewConfig = $this->getPreviewConfig($object);

        $filteredParameters = [];
        foreach ($previewConfig as $config) {
            $name = $config['name'];
            $selectedValue = $parameters[$name] ?? $config['defaultValue'];

            if (!empty($selectedValue)) {
                $filteredParameters[$name] = $selectedValue;
            }
        }

        return $filteredParameters;
    }

    public function getPreviewConfig(Concrete $object): array
    {
        return array_filter([
            $this->getLocalePreviewConfig($object),
            $this->getSitePreviewConfig($object),
        ]);
    }

    protected function getLocalePreviewConfig(Concrete $object): array
    {
        $user = Tool\Authentication::authenticateSession();
        $userLocale = $user->getLanguage();

        $locales = [];
        foreach (Tool::getValidLanguages() as $locale) {
            $label = sprintf('%s (%s)', \Locale::getDisplayLanguage($locale, $userLocale), $locale);
            $locales[$label] = $locale;
        }

        return [
            'name' => PreviewGeneratorInterface::PARAMETER_LOCALE,
            'label' => $this->translator->trans('preview_generator_locale', [], Translation::DOMAIN_ADMIN),
            'values' => $locales,
            'defaultValue' => in_array($userLocale, Tool::getValidLanguages()) ? $userLocale : Tool::getDefaultLanguage(),
        ];
    }

    protected function getSitePreviewConfig(Concrete $object): array
    {
        $sites = new Site\Listing();
        $sites->setOrderKey('mainDomain')->setOrder('ASC');

        if ($sites->count() == 0) {
            return [];
        }

        $sitesOptions = [
            $this->translator->trans('main_site', [], Translation::DOMAIN_ADMIN) => '0',
        ];

        $preSelectedSite = null;
        foreach ($sites as $site) {
            $label = $site->getRootDocument()?->getKey();
            $sitesOptions[$label] = $site->getId();

            $domains = $site->getDomains();
            array_unshift($domains, $site->getMainDomain());

            if (is_null($preSelectedSite) && in_array(Tool::getHostname(), $domains)) {
                $preSelectedSite = $sitesOptions[$label];
            }
        }

        return [
            'name' => PreviewGeneratorInterface::PARAMETER_SITE,
            'label' => $this->translator->trans('preview_generator_site', [], Translation::DOMAIN_ADMIN),
            'values' => $sitesOptions,
            'defaultValue' => $preSelectedSite ?? reset($sitesOptions),
        ];
    }

    /**
     * @internal
     */
    #[Required]
    public function setTranslator(Translator $translator): void
    {
        $this->translator = $translator;
    }
}
