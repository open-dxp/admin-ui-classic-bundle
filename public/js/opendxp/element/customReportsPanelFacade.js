opendxp.registerNS('opendxp.element.customReportsPanelFacade');

opendxp.element.customReportsPanelFacade = new Class.create({
    name: 'customReportsPanelImplementationFactory',
    className: null,

    initialize: function () {
        if(!opendxp.globalmanager.get(this.name)) {
            opendxp.globalmanager.add(this.name, this);
        }
    },

    getRegistry: function () {
        return opendxp.globalmanager.get(this.name);
    },

    getImplementation: function () {
        return this.getRegistry().className
    },

    hasImplementation: function () {
        return this.getImplementation() !== null;
    },

    registerImplementation: function (className) {
        this.getRegistry().className = className;
    },

    getNewReportInstance: function (type = null) {
        if(this.hasImplementation()){
            //call implementation
            try {
                reportClass = stringToFunction(this.className);
                return new reportClass(type);
            }
            catch (e) {
                console.log(e);
            }
        }
    }
});

const customReportsPanelFacade = new opendxp.element.customReportsPanelFacade();