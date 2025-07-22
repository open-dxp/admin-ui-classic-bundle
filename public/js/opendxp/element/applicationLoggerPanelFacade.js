opendxp.registerNS('opendxp.element.applicationLoggerPanelFacade');

opendxp.element.applicationLoggerPanelFacade = new Class.create({
    name: 'applicationLoggerPanelImplementationFactory',
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

    getNewLoggerInstance: function (config) {
        if(this.hasImplementation()){
            //call implementation
            try {
                appLoggerClass = stringToFunction(this.className);
                return new appLoggerClass(config);
            }
            catch (e) {
                console.log(e);
            }
        }
    }
});

const applicationLoggerPanelFacade = new opendxp.element.applicationLoggerPanelFacade();