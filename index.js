'use strict';

const express = require('express');
const bodyParser = require('body-parser');


const restService = express();
restService.use(bodyParser.json());

restService.post('/webhook', function (req, res) {

    console.log('webhook request');

    try {
        var speech = 'empty response';

        if (req.body) {

            if (req.body.result) {
                speech = '';

                switch(req.body.result.action){
                    case 'responsible':
                        switch(req.body.result.parameters.System){
                            case 'iSMS':
                                speech += 'Rogério Pereira';
                                break;
                            case 'BORA':
                                speech += 'Romanine';
                                break;
                            case 'TEN':
                            case 'TaskApp':
                                speech += 'Alex Wzorek';
                                break;
                            case 'CATES':
                            case 'URE':
                            case 'FPT':
                                speech += 'Bruno Perico';
                                break;
                            case 'CIP':
                                speech += 'Flavio Faust';
                                break;
                            default:
                                speech += 'Help Desk';
                        }
                    default:
                    speech += ''
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
