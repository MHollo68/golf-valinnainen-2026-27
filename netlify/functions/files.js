const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    const store = getStore({ name: 'golf-tiedostot', consistency: 'strong' });
    const params = event.queryStringParameters || {};

    if (event.httpMethod === 'GET' && params.key) {
      const result = await store.getWithMetadata(params.key, { type: 'blob' });
      if (!result) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
      }
      const arrayBuffer = await result.data.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': result.metadata.contentType || 'application/octet-stream',
          'Content-Disposition': `inline; filename="${result.metadata.fileName || 'file'}"`,
        },
        body: base64,
        isBase64Encoded: true,
      };
    }

    if (event.httpMethod === 'GET' && params.list) {
      const { blobs } = await store.list({ prefix: `date/${params.list}/` });
      const files = [];
      for (const blob of blobs) {
        const meta = await store.getMetadata(blob.key);
        if (meta) {
          files.push({
            key: blob.key,
            fileName: meta.metadata.fileName,
            contentType: meta.metadata.contentType,
            size: meta.metadata.size,
            uploadedAt: meta.metadata.uploadedAt,
          });
        }
      }
      return { statusCode: 200, headers, body: JSON.stringify(files) };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      const { dateKey, fileName, contentType, data } = body;

      if (!dateKey || !fileName || !data) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing fields' }) };
      }

      const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const blobKey = `date/${dateKey}/${Date.now()}_${safeFileName}`;
      const buffer = Buffer.from(data, 'base64');

      await store.set(blobKey, buffer, {
        metadata: {
          fileName,
          contentType: contentType || 'application/octet-stream',
          size: String(buffer.length),
          uploadedAt: new Date().toISOString(),
        },
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true, key: blobKey, fileName }),
      };
    }

    if (event.httpMethod === 'DELETE' && params.key) {
      await store.delete(params.key);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  } catch (err) {
    console.error('Files function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal error', detail: err.message }),
    };
  }
};
