'use strict';

const express = require('express');
const bodyParser = require('body-parser');


const restService = express();
restService.use(bodyParser.json());

restService.post('/webhook', function (req, res) {

    console.log('webhook request');

    try {
        var assigened = 'Help Desk';

        if (req.body) {

            if (req.body.result) {
                assigened = '';

                switch(req.body.result.action){
                    case 'responsible':
                        switch(req.body.result.parameters.System){
                            case 'iSMS':
                                switch(req.body.result.parameters.Area){
                                    case 'Vendas':
                                        assigened = 'Monique Oliveira';
                                        break;
                                    case 'Operações':
                                        assigened = 'Rogério Pereira';
                                        break;
                                    case 'Trade':
                                        assigened = 'Bruno Perico';
                                        break;
                                    default:
                                        assigened = 'Claudia Laurente';
                                        break;
                                }
                                break;
                            case 'BORA':
                                assigened = 'Romanine';
                                break;
                            case 'TEN':
                            case 'TaskApp':
                                assigened = 'Alex Wzorek';
                                break;
                            case 'CATES':
                            case 'URE':
                            case 'FPT':
                                assigened = 'Bruno Perico';
                                break;
                            case 'CIP':
                                assigened = 'Flavio Faust';
                                break;
                            default:
                                assigened = 'Help Desk';
                        }
                    default:
                    speech += ''
                }
            }
        }

        console.log('result: ', speech);

        return res.json({

            messages: [
                {
                    type: 0,
                    speech: "Hi! Nice to meet you, $name! What is your hobby?"
                }
            ]

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
