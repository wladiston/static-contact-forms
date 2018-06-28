import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import { map, padEnd, capitalize } from 'lodash';
import schema from './validate';

// The Sendgrid API
import * as sgMail from '@sendgrid/mail';
sgMail.setApiKey(functions.config().sendgrid.key);

// Express app
const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

/**
 * Send the email using the sendgrid
 *
 * @param {string} templateId
 * @param {*} props object containing all the data sent on the email
 * @returns Promise
 */
const sendSendgridmail = (templateId, props) => {
    // extract vital data to send the email
    const { from, subject, defaulttemplate } = functions.config().sendgrid;
    const {
        _to,
        _replyto,
        _subject = subject,
        _cc,
        ...other
    } = props;
    console.log(`Sending Email ${templateId} to ${_to}`);
    
    const msg = {
        to: _to,
        from,
        reply_to: _replyto || other.email,
        template_id: templateId || defaulttemplate,
        subject: _subject,
        cc: _cc,
        text: map(other, (v, k) => `${padEnd(capitalize(k), 20)}: ${v}`).join('\n'),
        html: map(other, (v, k) => `<p><b>${capitalize(k)}:</b><br/> ${v}</p>`).join('<br/>')
    };

    return sgMail.send(msg);
}


/**
 * Validate and send the email when have a POST to / or /:templateId
 *
 * @param {*} request
 * @param {*} response
 * @returns
 */
const emailAPI = (request, response) => {
    // validate the data sent
    return schema.validate(request.body)
        .then(() => {
            const {
                _next,
                _gotcha,
                ...emailData
            } = request.body;

            return sendSendgridmail(request.params.templateId, emailData).then(() => {
                console.log(`Email sent`);
                // Is ajax request
                if (request.xhr) return response.status(200).send({ send: true });

                return response.redirect(_next);
            });
        })
        .catch(err => {
            console.log(`Validation error`, err.errors);
            return response.status(400).send(err.errors);;
        });
};

app.post('/:templateId', emailAPI);
app.post('*', emailAPI);


export const appServe = functions.https.onRequest(app);