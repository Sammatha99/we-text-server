const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string()
      .required()
      .default(
        'mongodb+srv://trangAdmin:trangAdmin@cluster0.ckkl7.mongodb.net/we-text-database-testing?retryWrites=true&w=majority'
      )
      .description('Mongo DB url'),
    JWT_SECRET: Joi.string().default(`wetextappkey321`).required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(5)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().default(`smtp.gmail.com`).description('server that will send the emails'),
    SMTP_PORT: Joi.number().default(465).description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().default('itcoupletesting@gmail.com').description('username for email server'),
    SMTP_PASSWORD: Joi.string().default(`ITCOUPLETESTING9998`).description('password for email server'),
    EMAIL_FROM: Joi.string()
      .default('itcoupletesting@gmail.com')
      .description('the from field in the emails sent by the app'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: 'mongodb+srv://trangAdmin:trangAdmin@cluster0.ckkl7.mongodb.net/we-text-database-testing?retryWrites=true&w=majority',
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: `wetextappkey321`,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: `smtp.gmail.com`,
      port: 465,
      auth: {
        user: 'itcoupletesting@gmail.com',
        pass: `ITCOUPLETESTING9998`,
      },
    },
    from: 'itcoupletesting@gmail.com',
  },
};
