// FILE: test-sanity-query.js
// Temporary file to test Sanity queries

import { client } from './sanity/lib/client.js';

// Test query to see what data exists
const testQuery = `*[_type == "blog"] {
  _id,
  title,
  image,
  featured,
  _createdAt
}`;

client.fetch(testQuery)
  .then(result => {
    console.log('Blog posts in Sanity:', JSON.stringify(result, null, 2));
  })
  .catch(error => {
    console.error('Error fetching from Sanity:', error);
  });
