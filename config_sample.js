var config = {}

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
config.google_analytics.json_path = 'client_secret_9999999.project.googleusercontent.com.json';
config.google_analytics.web.auth_uri = 'https://accounts.google.com/o/oauth2/auth';
config.google_analytics.web.client_secret = 'asdfasdfasdf';


{"web":{
	"auth_uri":"https://accounts.google.com/o/oauth2/auth",
	"client_secret":"6rSZfsoMDbyfLefVXtnrJrWJ",
"token_uri":"https://accounts.google.com/o/oauth2/token",
"client_email":"1613113559@project.googleusercontent.com",
"client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/1613113559@project.googleusercontent.com",
"client_id":"1613113559.project.googleusercontent.com",
"auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs"}}

module.exports = config;