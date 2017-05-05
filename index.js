'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const restService = express();

restService.use(bodyParser.json());

restService.post('/webhook', function (req, res) {

    console.log('webhook request');

    try {
        var helper = require('sendgrid').mail;
        var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

        var speech = '';
        var assigened = 'Help Desk';
        var assigenedMail = 'flavio.faust@pmi.com';
        var name = '';
        var system = '';
        var area = '';
        var email = '';

        if (req.body) {

            if (req.body.result) {
                assigened = '';

                switch(req.body.result.action){
                    case 'responsible':
                        name = req.body.result.parameters.Name;
                        system = req.body.result.parameters.System;
                        area = req.body.result.parameters.Area;
                        switch(system){
                            case 'iSMS':
                                switch(area){
                                    case 'Vendas':
                                        assigened = 'Monique Oliveira';
                                        assigenedMail = 'vinicius.gehlen@pmi.com';
                                        break;
                                    case 'Operações':
                                        assigened = 'Rogério Pereira';
                                        assigenedMail = 'miguel.barateir@pmi.com';
                                        break;
                                    case 'Trade':
                                        assigened = 'Bruno Perico';
                                        assigenedMail = 'flavio.faust@pmi.com';
                                        break;
                                    default:
                                        assigened = 'Claudia Laurente';
                                        assigenedMail = 'flavio.faust@pmi.com';
                                        break;
                                }
                                break;
                            case 'BORA':
                                assigened = 'Alex Romanine';
                                assigenedMail = 'miguel.barateiro@pmi.com';
                                break;
                            case 'TEN':
                            case 'TaskApp':
                                assigened = 'Alex Wzorek';
                                assigenedMail = 'flavio.faust@pmi.com';
                                break;
                            case 'CATES':
                            case 'URE':
                            case 'FPT':
                                assigened = 'Bruno Perico';
                                assigenedMail = 'flavio.faust@pmi.com';
                                break;
                            case 'CIP':
                                assigened = 'Flavio Faust';
                                assigenedMail = 'flavio.faust@pmi.com';
                                break;
                            default:
                                assigened = 'Help Desk';
                                assigenedMail = 'flavio.faust@pmi.com';
                                break;
                        }
                        speech += "Ok " + name + ", estou abrindo uma requisição de suporte em seu nome. O responsável pelo seu problema é " + assigened + ".";
                        email = "Você tem uma nova requisição de suporte:" +
                                "/nUsuário: " + name +
                                "/nÁrea: " + area +
                                "/nSistema: " + system +
                                "/n/nEsta requisição foi aberta via #Slack ;)";

                        var from_email = new helper.Email("flaviofaust@gmail.com");
                        var to_email = new helper.Email(assigenedMail);
                        var subject = "Requisição de suporte #Slack";
                        var content = new helper.Content("text/plain", email);
                        var mail = new helper.Mail(from_email, subject, to_email, content);

                        var request = sg.emptyRequest({
                          method: 'POST',
                          path: '/v3/mail/send',
                          body: mail.toJSON(),
                        });

                        sg.API(request, function(error, response) {
                          console.log(response.statusCode);
                          console.log(response.body);
                          console.log(response.headers);
                        });

                        break;
                    default:
                    break;
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
