const { getStore } = require('@netlify/blobs');

const BLOB_KEY = 'golf-calendar-data';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    const store = getStore({ name: 'golf-kalenteri', consistency: 'strong' });

    if (event.httpMethod === 'GET') {
      const data = await store.get(BLOB_KEY, { type: 'json' });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data || {}),
      };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      await store.setJSON(BLOB_KEY, body);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true }),
      };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  } catch (err) {
    console.error('Calendar function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal error', detail: err.message }),
    };
  }
};
