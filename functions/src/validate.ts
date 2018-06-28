import { object, string } from 'yup';

const formSchema = object({
    _to: string()
        .email()
        .required(),
    _replyto: string()
        .email(),
    _next: string()
        .required(),
    _subject: string(),
    _cc: string()
        .email(),
    _gotcha: string()
        .matches(/^$/, 'You don`t seem to be a trustful person! :)'),
    email: string()
        .email()
})

export default formSchema;