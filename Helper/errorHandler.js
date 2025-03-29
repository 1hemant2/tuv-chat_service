class CustomErrors extends Error {
    constructor(message, status) { 
        super(message); 
        this.status = status; 
    }
    errors(message, status) { 
        const error = new Error(message);
        error.status = status;
        return error;
    }
}

const customErrors = new CustomErrors();
module.exports = {errors : customErrors.errors}