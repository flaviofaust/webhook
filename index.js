'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const restService = express();

var newOrder = false;
var customer = '';
var products = [];
var amounts = [];

restService.use(bodyParser.json());

restService.post('/webhook', function (req, res) {

    console.log('webhook request');

    try {
        var helper = require('sendgrid').mail;
        var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

        var speech = '';
        var assigened = 'Help Desk';
        var assigenedMail = 'flavio.faust@pmi.com';
        var name = 'Flavio';
        var email = '';   
		var i = 0;

        if (req.body) {

            if (req.body.result) {
                assigened = '';

                switch(req.body.result.action){
                    case 'Order':
                        newOrder = true;
                        break;
                    case 'Order.Customer':
                        if(newOrder){
                            customer = req.body.result.parameters.customer;                            
                        }
                        break;
					case 'Order.Customer.Product':
                        if(newOrder){
                            products = [];							                           
                        }
						products.push(req.body.result.parameters.product); 
						newOrder = false;
                        break;
					case 'Order.Customer.Product.Amount':
                        if(newOrder){
                            amounts = [];							                           
                        }
						amounts.push(req.body.result.parameters.amount); 
						newOrder = false;
                        break;						
					case 'Order.End':                   
                        var os = require("os");
                        speech += "Ok, estou finalizando a ordem para o cliente " + customer + ":"; 

                        email = "Uma nova ordem de vendas foi criada: " +
                                "\r\n\r\nCliente: " + customer +
								"\r\n\r\nProdutos: ";
								
								for (i = 0; i < products.length; i++) {
									 email += "\r\n\r\n" + amounts[i] + " x " + products[i];
									 speech += "\n" + amounts[i] + " unidades de " + products[i];
								} 
				
                                email += "\r\n\r\n\r\n\r\nEsta ordem foi criada via @Telegram ;)";
								
						speech += "O processo de faturamento será inciado em breve! Até mais e obrigado ;-) ";

                        var from_email = new helper.Email("flaviofaust@gmail.com");
                        var to_email = new helper.Email(assigenedMail);
                        var subject = "Nova ordem de vendas @Telegram";
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
