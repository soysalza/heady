// mo-siqqa-signup/netlify/functions/subscribe.js

const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  const apiKey = process.env.MailerLite_APIKey;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'MailerLite API key not configured.' }),
    };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid JSON input.' }),
    };
  }

  const { email, name } = data;

  if (!email || !name) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing name or email.' }),
    };
  }

  try {
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email,
        name,
      }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      return {
        statusCode: response.status,
        body: JSON.stringify({
          message: errorResponse.message || 'Failed to subscribe.',
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Subscription successful!' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error. Please try again later.' }),
    };
  }
};
