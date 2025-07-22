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

namespace OpenDxp\Bundle\AdminBundle\Controller\Admin\Document;

use OpenDxp\Model\Document;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/folder", name="opendxp_admin_document_folder_")
 *
 * @internal
 */
class FolderController extends DocumentControllerBase
{
    /**
     * @Route("/get-data-by-id", name="getdatabyid", methods={"GET"})
     *
     * @throws \Exception
     */
    public function getDataByIdAction(Request $request): JsonResponse
    {
        $folder = Document\Folder::getById((int)$request->get('id'));
        if (!$folder) {
            throw $this->createNotFoundException('Folder not found');
        }

        $folder = clone $folder;
        $folder->setParent(null);

        $data = $folder->getObjectVars();
        $data['locked'] = $folder->isLocked();

        $this->addTranslationsData($folder, $data);
        $this->minimizeProperties($folder, $data);
        $this->populateUsersNames($folder, $data);

        return $this->preSendDataActions($data, $folder);
    }

    /**
     * @Route("/save", name="save", methods={"PUT", "POST"})
     *
     * @throws \Exception
     */
    public function saveAction(Request $request): JsonResponse
    {
        $folder = Document\Folder::getById((int) $request->get('id'));
        if (!$folder) {
            throw $this->createNotFoundException('Folder not found');
        }

        $result = $this->saveDocument($folder, $request, false, self::TASK_PUBLISH);
        /** @var Document\Folder $folder */
        $folder = $result[1];
        $treeData = $this->getTreeNodeConfig($folder);

        return $this->adminJson(['success' => true, 'treeData' => $treeData]);
    }

    protected function setValuesToDocument(Request $request, Document $document): void
    {
        $this->addPropertiesToDocument($request, $document);
    }
}
