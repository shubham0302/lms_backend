class ResponseWraper {
    #res;
    constructor(response) {
        this.#res = response;
    }
    #handle({ data, success_code, fail_code }) {
        if (success_code) {
            // console.log(data);
            return this.#res.status(success_code).send({ success: true, data, error: {} });
        }
        return this.#res.status(fail_code).send({ success: false, error: data, data: {} });
    }
    created(data) {
        return this.#handle({ data, success_code: 201 });
    }
    ok(data) {
        return this.#handle({ data, success_code: 200 });
    }
    badRequest(message) {
        return this.#handle({
            data: {
                message: message || '',
            },
            fail_code: 400,
        });
    }
    unauthorized(message) {
        return this.#handle({
            data: {
                message: message || '',
            },
            fail_code: 401,
        });
    }

    forbidden(message) {
        return this.#handle({
            data: {
                message: message || '',
            },
            fail_code: 403,
        });
    }

    notFound(message) {
        return this.#handle({
            data: {
                message: message || '',
            },
            fail_code: 404,
        });
    }

    unprocessableEntity(message) {
        return this.#handle({
            data: {
                message: message || 'Invalid Data',
            },
            fail_code: 422,
        });
    }

    internalServerError(message) {
        return this.#handle({
            data: {
                message: message || 'Internal Server Error.',
            },
            fail_code: 500,
        });
    }
}
module.exports = ResponseWraper