// netlify/functions/get-content.js
// ============================================
// EMS — Supabase Content API
// Endpoint: /.netlify/functions/get-content
//
// Query params:
//   ?type=services          → all published services
//   ?type=services&id=uuid  → single service
//   ?type=listings&lga=Uyo  → directory listings by LGA
//   ?type=listings&category=hospital → by category
//   ?type=reviews           → approved reviews
//   ?type=posts             → published blog posts
//   ?type=posts&slug=my-post → single post
// ============================================

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {

  // CORS headers — allow your site to call this function
  const headers = {
    'Access-Control-Allow-Origin': 'https://www.evemassages.com',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=60' // cache for 60 seconds
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const params = event.queryStringParameters || {};
  const { type, id, slug, lga, category, featured } = params;

  try {

    // ── SERVICES ──
    if (type === 'services') {
      let query = supabase
        .from('services')
        .select('*')
        .eq('status', 'published')
        .order('price_ngn', { ascending: true });

      if (id)       query = query.eq('id', id);
      if (featured) query = query.eq('featured', true);
      if (category) query = query.eq('category', category);

      const { data, error } = await query;
      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, data })
      };
    }

    // ── DIRECTORY LISTINGS ──
    if (type === 'listings') {
      let query = supabase
        .from('listings')
        .select('*')
        .eq('status', 'published')
        .order('name', { ascending: true });

      if (id)       query = query.eq('id', id);
      if (lga)      query = query.eq('lga', lga);
      if (category) query = query.eq('category', category);

      const { data, error } = await query;
      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, data })
      };
    }

    // ── REVIEWS ──
    if (type === 'reviews') {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, data })
      };
    }

    // ── BLOG POSTS ──
    if (type === 'posts') {
      let query = supabase
        .from('posts')
        .select('id, title, slug, excerpt, cover_image, category, tags, author, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (slug) {
        query = supabase
          .from('posts')
          .select('*')
          .eq('status', 'published')
          .eq('slug', slug)
          .single();
      }

      const { data, error } = await query;
      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, data })
      };
    }

    // ── SUBMIT REVIEW (POST request) ──
    if (type === 'submit-review' && event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { reviewer_name, rating, review_body, service } = body;

      if (!reviewer_name || !rating || !review_body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Missing required fields' })
        };
      }

      const { error } = await supabase
        .from('reviews')
        .insert([{
          reviewer_name,
          rating: parseInt(rating),
          body: review_body,
          service,
          approved: false // requires manual approval in Supabase dashboard
        }]);

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Review submitted for approval' })
      };
    }

    // ── UNKNOWN TYPE ──
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, error: 'Unknown type parameter' })
    };

  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
