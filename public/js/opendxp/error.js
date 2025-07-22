opendxp.registerNS("opendxp.error.ValidationException");

/**
 * @private
 */
opendxp.error.ValidationException = function (message) {
    this.message = message;
    if ("captureStackTrace" in Error) { // V8's native method, fallback otherwise
        Error.captureStackTrace(this, opendxp.error.ValidationException);
    } else {
        this.stack = (new Error()).stack;
    }
}

opendxp.error.ValidationException.prototype = Object.create(Error.prototype);
opendxp.error.ValidationException.prototype.name = "ValidationException";
opendxp.error.ValidationException.prototype.constructor = opendxp.error.ValidationException;

/**
 * @private
 */
opendxp.error.ActionCancelledException = function (message) {
    this.message = message;
    if ("captureStackTrace" in Error) { // V8's native method, fallback otherwise
        Error.captureStackTrace(this, opendxp.error.ActionCancelledException);
    } else {
        this.stack = (new Error()).stack;
    }
}
opendxp.error.ActionCancelledException.prototype = Object.create(Error.prototype);
opendxp.error.ActionCancelledException.prototype.name = "ActionCancelledException";
opendxp.error.ActionCancelledException.prototype.constructor = opendxp.error.ActionCancelledException;
