export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      // Serve static assets from the build directory
      if (env.ASSETS) {
        return await env.ASSETS.fetch(request);
      }
      return new Response('DecorAI Running', { status: 200 });
    } catch (e) {
      return new Response('Error loading assets: ' + e.message, { status: 500 });
    }
  },
};
