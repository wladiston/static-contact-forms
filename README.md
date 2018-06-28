# Static Contact Forms

A basic implemantation to a contact form for statics website. It uses the firebase to handle the form submittion and the sendgrid to dispatch the emails. The same project can be used for different websites with different email templates.


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

To have this project running you must install the config the *firebase-tools*. Use the following lines to install and set it up.

```zsh
npm install -g firebase-tools
firebase login
firebase use --add
```

You also must setup at least one transactional template in sendgrid.

### Installing

After cloning this project you will have to create a config file to get a development env running

Create the `.runtimeconfig.json` in the functions folder with the sendgrid details

```json
{
  "sendgrid": {
    "key": "SG.xxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "defaulttemplate": "MY-DEFAULT-TEMPLATE-ID",
    "from": "My Company <no-reply@mycompany.com>",
    "subject": "This is a default subject"
  }
}
```

Then you can install the dependencies and run the dev server

```zsh
cd functions/
npm install
npm run serve
```

After running the serve you should see the local endpoint for testings

```zsh
=== Serving from '/static-contact-forms'...

i  functions: Preparing to emulate functions.
✔  functions: sendEmail: http://localhost:5000/static-contact-forms/us-central1/sendEmail

```

## Deployment

To have this running in the firebase you'll need to set the env variables there first.

```
firebase functions:config:set sendgrid.key="SG.xxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
firebase functions:config:set sendgrid.defaulttemplate="MY-DEFAULT-TEMPLATE-ID"
firebase functions:config:set sendgrid.from="My Company <no-reply@mycompany.com>" 
firebase functions:config:set sendgrid.subject="This is a default subject" 
```

Then just simply run a `firebase deploy` and you are good to go.
You can setup a custom url in the firebase console if you wish.


## Using the service

Just send the form to the firebase hosting URL and that's it!

Example: 
```HTML
<form action="https://myfirebaseproject.firebaseapp.com"
      method="POST">
    <input type="hidden" name="_to" value="contact@myemail.com">
    <input type="hidden" name="_next" value="http://site.io/success">
    <input type="text" name="name">
    <input type="submit" value="Send">
</form>
```

Important to know:
* `action` attribute must go the server
* `method="POST"` only POST method is accepted
* `_to` and `_next` fields are required
* fields must have a name attribute


### Advanced features:

Form inputs can have specially named name-attributes, which alter functionality. They are all prefixed with an underscore.

#### `_to`

This value is used for the email's To field. The person who originally receive the form submition.

```html
<input type="text" name="_to" placeholder="email@site.io" />
```

#### `_replyto` or `email`

This value is used for the email's Reply-To field. This way you can directly "Reply" to the email to respond to the person who originally submitted the form.

```html
<input type="text" name="_replyto" placeholder="Your email" />
OR
<input type="text" name="email" placeholder="Your email" />
```

#### `_next`

By default, after submitting a form the user is shown the Formspree "Thank You" page. You can provide an alternative URL for that page.

```html
<input type="hidden" name="_next" value="https://site.io/thanks.html" />
```

#### `_subject`

This value is used for the email's subject, so that you can quickly reply to submissions without having to edit the subject line each time.

```html
<input type="hidden" name="_subject" value="New submission!" />
```

#### `_cc`

This value is used for the email's CC Field. This lets you send a copy of each submission to another email address.

```html
<input type="hidden" name="_cc" value="another@email.com" />
```

If you want to CC multiple email addresses, then just make it a list of email addresses separate by commas.

```html
<input type="hidden" name="_cc" value="another@email.com,yetanother@email.com" />
```

#### `_gotcha`

Add this "honeypot" field to avoid spam by fooling scrapers. If a value is provided, the submission will be silently ignored. The input should be hidden with CSS.

All forms come with reCAPTCHA, which uses advanced machine learning techniques to distinguish between humans and bots, so for most forms this isn't necessary.

```html
<input type="text" name="_gotcha" style="display:none" placeholder="Don't touch here if you are human" />
```

#### Template ID

If you wish to use a custom template for the form you can create the template on the sendgrid and add it to the action attribute.

Example: 
```HTML
<form action="https://myfirebaseproject.firebaseapp.com/MYTEMPLATEID"
      method="POST">
      ...
</form>
```

## Built With

* [Firebase](https://firebase.google.com/) - Hosting
* [Sendgrid](https://sendgrid.com/) - Email dispatcher

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Wlad Paiva** - *Initial work* - [wladiston](https://github.com/wladiston)

## Acknowledgments

This project was inspirared by [formspree.io](https://formspree.io) which is an amazing solution for static websites but it doesn't support custom email templates.
