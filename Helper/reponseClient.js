class ResponseClient {
    constructor() {
        this.status = 200;
        this.message = '';
        this.data = null;
        this.success = '';
    }
    setSuccess(data) {
        this.status = 200;
        this.success = true;
        this.message = 'request successfull';
        this.data = data;
    }
    setError(status, message) {
        this.status = status;
        this.message = message;
        this.success = false;
    }
    send(res) {
        res.status(this.status).json({
            message: this.message,
            data: this.data
        });
    }
}

const responseClient = new ResponseClient();
module.exports = {responseClient};