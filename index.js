'use strict';

const express = require('express');
const bodyParser = require('body-parser');


const restService = express();
restService.use(bodyParser.json());

restService.post('/webhook', function (req, res) {

    console.log('webhook request');

    try {
        var speech = 'empty speech';

        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
                speech = '';

                var requestAction = requestBody.result.action;
                
                if(requestAction == ''){
                
                    if (requestBody.result.parameters) {
                        if(requestBody.result.parameters.System == 'iSMS'){
                            speech += 'Sugiro falar com Rogério Pereira';
                        }
                        if(requestBody.result.parameters.System == 'CIP'){
                            speech += 'Sugiro falar com Flavio Faust';
                        }
                        if(requestBody.result.parameters.System == 'TEN'){
                            speech += 'Sugiro falar com Alex Wzorek';
                        }
                        if(requestBody.result.parameters.System == 'BORA'){
                            speech += 'Sugiro falar com Romanine';
                        }


                        speech += ' ';
                    }

                }
            }
        }

        console.log('result: ', speech);

        return res.json({
            speech: speech,
            displayText: speech,
            source: 'apiai-webhook-sample'
        });
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});
