opendxp.registerNS('opendxp.element.selector.searchFacade');

opendxp.element.selector.searchFacade = new Class.create({
    name: 'searchImplementationRegistry',
    searchClass: null,

    initialize: function () {
        if(!opendxp.globalmanager.get(this.name)) {
            opendxp.globalmanager.add(this.name, this);
        }
    },

    getRegistry: function () {
        return opendxp.globalmanager.get(this.name);
    },

    getImplementation: function () {
        return this.getRegistry().searchClass;
    },

    hasImplementation: function () {
        return this.getImplementation() !== null;
    },

    registerImplementation: function (searchClass) {
        this.getRegistry().searchClass = searchClass;
    },

    openItemSelector: function (multiselect, callback, restrictions, config) {
        if(this.hasImplementation()) {
            this.getImplementation().openItemSelector(multiselect, callback, restrictions, config);
        }
    },

    showQuickSearch: function () {
        if(this.hasImplementation()){
            this.getImplementation().showQuickSearch();
        }
    },

    hideQuickSearch: function () {
        if(this.hasImplementation()){
            this.getImplementation().hideQuickSearch();
        }
    },

    getObjectRelationInlineSearchRoute: function () {
        if(this.hasImplementation()) {
            return this.getImplementation().getObjectRelationInlineSearchRoute();
        }
        return null;
    }
});

const searchFacade = new opendxp.element.selector.searchFacade();
