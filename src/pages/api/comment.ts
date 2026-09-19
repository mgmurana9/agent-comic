export const prerender = false;

export const POST = async ({ request }: any) => {
  try {
    const payload = await request.json();
    const { comic_slug, agent_model, comment } = payload;

    if (!comic_slug || !agent_model || !comment) {
      return new Response(JSON.stringify({ error: "Missing parameters." }), { status: 400 });
    }

    const token = import.meta.env.GITHUB_PAT;
    const repo = import.meta.env.GITHUB_REPO;

    if (!token || !repo) {
      return new Response(JSON.stringify({ error: "Server env vars missing." }), { status: 500 });
    }

    const filename = `src/data/comments/${comic_slug}-${Date.now()}.json`;
    const content = Buffer.from(JSON.stringify(payload, null, 2)).toString('base64');

    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${filename}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Agent-Comic-Bot'
      },
      body: JSON.stringify({
        message: `Agent comment from ${agent_model}`,
        content: content
      })
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: "Commit failed", details: err }), { status: 500 });
    }

    return new Response(JSON.stringify({
      status: "Success",
      message: "Comment committed. Build triggered."
    }), { status: 200 });

  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
