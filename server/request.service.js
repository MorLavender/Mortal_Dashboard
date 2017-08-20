"use strict";
const request = require("request");
class RequestService {
    constructor() {
        this.credentialsEncoded = 'dHNnLWJ0by1hcHBzLWJ1aWxkOlRzZ2J0b0BwcHNidWlsZA==';
    }
    getRequestHeaders() {
        return {
            "Authorization": `Basic ${this.credentialsEncoded}`
        };
    }
    get(url) {
        const options = {
            url: url,
            headers: this.getRequestHeaders()
        };
        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(body);
                }
            });
        });
    }
}
exports.RequestService = RequestService;