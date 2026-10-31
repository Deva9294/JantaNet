"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type Post = {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string };
  _count: { likes: number; comments: number };
  likedByMe: boolean;
};

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [cursor, setCursor] = useState<string | null>(null);

  async function loadFeed(append = false) {
    const response = await fetch("/api/posts" + (append && cursor ? "?cursor=" + encodeURIComponent(cursor) : ""));
    const data = await response.json();
    if (!response.ok) { setError(data.error || "Feed load nahi ho saka."); return; }
    setPosts(current => append ? [...current, ...data.posts] : data.posts);
    setCursor(data.nextCursor);
  }

  useEffect(() => { void loadFeed(); }, []);

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content.trim()) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Post publish nahi hua.");
      setPosts(current => [data.post, ...current]); setContent("");
    } catch (e) { setError(e instanceof Error ? e.message : "Kuch galat hua."); }
    finally { setBusy(false); }
  }

  async function toggleLike(postId: string) {
    const response = await fetch("/api/posts/" + postId + "/like", { method: "POST" });
    const data = await response.json();
    if (!response.ok) { setError(data.error || "Like update nahi hua."); return; }
    setPosts(current => current.map(post => post.id === postId ? { ...post, likedByMe: data.liked, _count: { ...post._count, likes: post._count.likes + (data.liked ? 1 : -1) } } : post));
  }

  return <main className="feed-shell">
    <header className="feed-header"><Link href="/" className="feed-brand">Janta<span>Net</span></Link><Link href="/profile" className="feed-profile">My profile</Link></header>
    <section className="feed-content">
      <div className="feed-intro"><p className="eyebrow">YOUR COMMUNITY</p><h1>News Feed</h1><p>Share an update, start a conversation and stay connected.</p></div>
      <form className="composer" onSubmit={publish}>
        <label htmlFor="post-content">What’s happening?</label>
        <textarea id="post-content" value={content} onChange={e => setContent(e.target.value)} maxLength={5000} placeholder="Share something with your community..." />
        <div className="composer-footer"><span>{content.length}/5000</span><button disabled={busy || !content.trim()}>{busy ? "Publishing..." : "Publish post"}</button></div>
      </form>
      {error && <p className="feed-error" role="alert">{error}</p>}
      <div className="post-list">
        {posts.map(post => <article className="post-card" key={post.id}>
          <div className="post-author"><div className="post-avatar">{post.author.name.slice(0,1).toUpperCase()}</div><div><strong>{post.author.name}</strong><small>{new Date(post.createdAt).toLocaleString()}</small></div></div>
          <p className="post-content">{post.content}</p>
          <div className="post-actions"><button onClick={() => void toggleLike(post.id)} aria-pressed={post.likedByMe}>{post.likedByMe ? "♥ Liked" : "♡ Like"} · {post._count.likes}</button><span>Comments · {post._count.comments}</span></div>
        </article>)}
        {!posts.length && <div className="empty-feed">Your feed is ready. Publish the first update and start the conversation.</div>}
      </div>
      {cursor && <button className="load-more" onClick={() => void loadFeed(true)}>Load more</button>}
    </section>
  </main>;
}
