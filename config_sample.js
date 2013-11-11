var config = {};

config.twitter = {};
config.instagram = {};
config.pinterest = {};
config.google_analytics = {};
config.mailchimp = {};
config.twitter = {};

// TWITTER
config.twitter.user_name = process.env.TWITTER_USER || 'username';
config.twitter.password =  process.env.TWITTER_PASSWORD || 'password';

// GOOGLE ANALYTICS
// this is the file they gave us
config.google_analytics.json_path = 'client_secret_9999999.project.googleusercontent.com.json';
// this is the data in the file
config.google_analytics.web.auth_uri = 'https://accounts.google.com/o/oauth2/auth';
config.google_analytics.web.client_secret = 'asdfasdfasdf';
config.google_analytics.token_uri = 'https://accounts.google.com/o/oauth2/token';
config.google_analytics.client_email = '9999999@project.googleusercontent.com';
config.google_analytics.client_x509_cert_url = 'https://www.googleapis.com/robot/v1/metadata/x509/9999999@project.googleusercontent.com';
config.google_analytics.client_id = '9999999.project.googleusercontent.com';
config.google_analytics.auth_provider_x509_cert_url = 'https://www.googleapis.com/oauth2/v1/certs';

module.exports = config;