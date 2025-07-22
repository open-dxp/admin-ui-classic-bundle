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

 opendxp.registerNS("opendxp.events.x");

 /**
  * is called when the corresponding plugin is uninstalled via opendxp backend UI
  */
 opendxp.events.uninstall = "opendxp.uninstall";
 
 /**
  * opendxp backend UI is loaded
  * viewport is passed as parameter
  */
 opendxp.events.opendxpReady = "opendxp.ready";

 /**
  * before asset is opened
  * asset and type are passed as parameters
  */
 opendxp.events.preOpenAsset = "opendxp.asset.preOpen";
 
 /**
  * after asset is opened
  * asset and type are passed as parameters
  */
 opendxp.events.postOpenAsset = "opendxp.asset.postOpen";
 
 /**
  * before asset is saved
  * asset id and task is passed as parameter
  */
 opendxp.events.preSaveAsset = "opendxp.asset.preSave";
 
 /**
  * after asset is saved
  * asset id is passed as parameter
  */
 opendxp.events.postSaveAsset = "opendxp.asset.postSave";
 
 /**
  * before asset is deleted
  * asset id is passed as parameter
  */
 opendxp.events.preDeleteAsset = "opendxp.asset.preDelete";
 
 /**
  * after asset is deleted
  * asset id is passed as parameter
  */
 opendxp.events.postDeleteAsset = "opendxp.asset.postDelete";
 
 /**
  * before document is opened
  * document and type are passed as parameters
  */
 opendxp.events.preOpenDocument = "opendxp.document.preOpen";
 
 /**
  * after document is opened
  * document and type are passed as parameters
  */
 opendxp.events.postOpenDocument = "opendxp.document.postOpen";
 
 /**
  * before document is saved
  * document, type, task and onlySaveVersion are passed as parameters
  */
 opendxp.events.preSaveDocument = "opendxp.document.preSave";
 
 /**
  * after document is saved
  * document, type, task and onlySaveVersion are passed as parameters
  */
 opendxp.events.postSaveDocument = "opendxp.document.postSave";
 
 /**
  * before document is deleted
  * document id is passed as parameter
  */
 opendxp.events.preDeleteDocument = "opendxp.document.preDelete";
 
 /**
  * after document is deleted
  * document id is passed as parameter
  */
 opendxp.events.postDeleteDocument = "opendxp.document.postDelete";
 
 /**
  * after the document is successfully created in the tree
  * document id is passed as parameter
  */
 opendxp.events.postAddDocumentTree = "opendxp.documentTree.postAdd";
 
 /**
  * before object is opened
  * object and type are passed as parameters
  */
 opendxp.events.preOpenObject = "opendxp.object.preOpen";
 
 /**
  * after object is opened
  * object and type are passed as parameters
  */
 opendxp.events.postOpenObject = "opendxp.object.postOpen";
 
 /**
  * before object is saved
  * object and type are passed as parameters
  */
 opendxp.events.preSaveObject = "opendxp.object.preSave";
 
 /**
  * after object is saved
  * object is passed as parameter
  */
 opendxp.events.postSaveObject = "opendxp.object.postSave";
 
 /**
  * before object is deleted
  * object id is passed as parameter
  */
 opendxp.events.preDeleteObject = "opendxp.object.preDelete";
 
 /**
  * after object is deleted
  * object id is passed as parameter
  */
 opendxp.events.postDeleteObject = "opendxp.object.postDelete";
 
 /**
  * after the object is successfully created in the tree
  * object id is passed as parameter
  */
 opendxp.events.postAddObjectTree = "opendxp.objectTree.postAdd";
 
 /**
  * called before navigation menu is created
  */
 opendxp.events.preCreateMenuOption = "opendxp.menuOption.preCreate";
 
 /**
  * @internal
  *
  * fired when asset metadata editor tab is created
  * editor and eventParams are passed as parameter
  */
 opendxp.events.preCreateAssetMetadataEditor = "opendxp.assetMetadataEditor.preCreate";
 
 /**
  * before opening the grid config dialog
  * url returning the metadata definitions is passed as parameter
  */
 opendxp.events.prepareAssetMetadataGridConfigurator = "opendxp.gridConfigurator.assetMetadata.prepare";
 
 /**
  * before context menu is opened
  * menu, tree and asset are passed as parameters
  */
 opendxp.events.prepareAssetTreeContextMenu = "opendxp.assetTreeContextMenu.prepare";
 
 /**
  * before context menu is opened
  * menu, tree and object are passed as parameters
  */
 opendxp.events.prepareObjectTreeContextMenu = "opendxp.objectTreeContextMenu.prepare";
 
 /**
  * before context menu is opened
  * menu, tree and document are passed as parameters
  */
 opendxp.events.prepareDocumentTreeContextMenu = "opendxp.documentTreeContextMenu.prepare";
 
 /**
  * before context menu is opened
  * allowedTypes array and source is passed as parameters
  */
 opendxp.events.prepareClassLayoutContextMenu = "opendxp.classLayoutContextMenu.prepare";
 
 /**
  * before context menu is opened on object folder
  * menu, grid and selectedRows are passed as parameters
  */
 opendxp.events.prepareOnRowContextmenu = "opendxp.onRowContextMenu.prepare";
 
 /**
  * before the data object is opened, after a tree node has been clicked
  * node item is passed as parameter
  */
 opendxp.events.prepareOnObjectTreeNodeClick = "opendxp.objectTreeNode.onClick";

/**
 * extends the affected nodes array on opendxp.elementservice.getAffectedNodes()
 */
opendxp.events.prepareAffectedNodes = "opendxp.treeNode.prepareAffectedNodes";

/**
  * before the data object grid folder configuration is loaded from the server.
  * request configuration is passed as parameter
  */
 opendxp.events.preGetObjectFolder = "opendxp.objectFolder.preGet";
 
 /**
  * before the data object grid items are loaded from the server
  * request configuration are passed as parameter
  */
 opendxp.events.preCreateObjectGrid = "opendxp.objectGrid.preCreate";
 
 /**
  * fired when a report has been opened
  * report grid panel gets passed as parameters
  */
 opendxp.events.postOpenReport = "opendxp.report.postOpen";
 
 /**
  *  before translations is edited
  *  translation and domain are passed as parameters
  */
 opendxp.events.preEditTranslations = "opendxp.translations.preEdit";
 
 /**
  * before document types grid loaded
  * grid and object are passed as parameters
  */
 opendxp.events.prepareDocumentTypesGrid = "opendxp.documentTypesGrid.prepare";

/**
 * before key bindings are registered
 * enable registering outside of core
 */
 opendxp.events.preRegisterKeyBindings = "opendxp.keyBindings.preRegister";

/**
 * before building menu
 * for adding menu entries with priorities to be sorted
 */
 opendxp.events.preMenuBuild = "opendxp.menu.preBuild";

/**
 * post building menu
 * for having full menu
 */
opendxp.events.postMenuBuild = "opendxp.menu.postBuild";

/**
 *  event for manipulating the wysiwyg config
 *  use it to change the final config that is passed
 *  the config and the editor context are passed as parameters
 */
opendxp.events.createWysiwygConfig = "opendxp.wysiwyg.createConfig";

/**
 *  start event for the editor to create the config
 *  config and context are passed as parameters
 */
opendxp.events.initializeWysiwyg = "opendxp.wysiwyg.initialize";

/**
 *  event for binding the editor to a field
 *  change event is registered here
 *  textarea and context are passed as parameters
 */
opendxp.events.createWysiwyg = "opendxp.wysiwyg.create";

/**
 *  change event needs to be fired by the editor implementation
 *  e, data and context are passed as parameters
 */
opendxp.events.changeWysiwyg = "opendxp.wysiwyg.change";

/**
 *  fired when an element is dropped
 *  create a link for documents, objects and assets
 *  target, dd, e, data and context are passed as parameters
 */
opendxp.events.onDropWysiwyg = "opendxp.wysiwyg.onDrop";

/**
 *  before the field of the editor is destroyed
 *  editor is destroyed here
 *  context is passed as parameters
 */
opendxp.events.beforeDestroyWysiwyg = "opendxp.wysiwyg.beforeDestroy";

/**
 * after settings tab of page is opened
 * layout and document are passed as parameter
 */
opendxp.events.prepareDocumentPageSettingsLayout = "opendxp.documentPageSettingsLayout.prepare";

/**
 * fired when global language is changed
 * layout and document are passed as parameter
 */
opendxp.events.globalLanguageChanged = "opendxp.globalLanguage.changed";

/**
 * fired when object key is edited
 * object and key are passed as parameter
 */
opendxp.events.postEditObjectKey = "opendxp.objectKey.postEdit";

/**
 * fired when asset key is edited
 * asset and key are passed as parameter
 */
opendxp.events.postEditAssetKey = "opendxp.assetKey.postEdit";

/**
 * fired when document key is edited
 * document and key are passed as parameter
 */
opendxp.events.postEditDocumentKey = "opendxp.documentKey.postEdit";

/**
 * fired after basic perspective element trees were  built
 *  array of custom perspective element trees  are passed as parameter
 */
opendxp.events.postBuildPerspectiveElementTree = "opendxp.elementTree.perspective.postBuild";
