"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type Item = { id:string; name?:string; title?:string; question?:string; description?:string; category?:string; location?:string; startsAt?:string; privacy?:string; _count?:{members?:number;followers?:number;attendees?:number}; isMember?:boolean; isFollowing?:boolean; isAttending?:boolean; options?:{id:string;text:string;_count:{votes:number};votedByMe:boolean}[] };
type Tab = "groups"|"pages"|"polls"|"events";

export default function CommunityPage(){
 const [tab,setTab]=useState<Tab>("groups");
 const [groups,setGroups]=useState<Item[]>([]),[pages,setPages]=useState<Item[]>([]),[polls,setPolls]=useState<Item[]>([]),[events,setEvents]=useState<Item[]>([]);
 const [name,setName]=useState(""),[description,setDescription]=useState(""),[category,setCategory]=useState("Community"),[question,setQuestion]=useState(""),[options,setOptions]=useState("Yes,No"),[location,setLocation]=useState(""),[startsAt,setStartsAt]=useState("");
 const [busy,setBusy]=useState(false),[error,setError]=useState("");
 async function load(){const endpoints=["groups","pages","polls","events"];const results=await Promise.all(endpoints.map(async e=>{const r=await fetch("/api/"+e);const d=await r.json();if(!r.ok)throw new Error(d.error||"Community data load failed");return d[e];}));setGroups(results[0]);setPages(results[1]);setPolls(results[2]);setEvents(results[3]);}
 useEffect(()=>{load().catch(e=>setError(e.message));},[]);
 async function send(path:string,body:unknown){setBusy(true);setError("");try{const r=await fetch("/api/"+path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});const d=await r.json();if(!r.ok)throw new Error(d.error||"Request failed");await load();setName("");setDescription("");setQuestion("");}catch(e){setError(e instanceof Error?e.message:"Something went wrong");}finally{setBusy(false);}}
 function submit(e:FormEvent){e.preventDefault();if(tab==="groups")void send("groups",{name,description,privacy:"PUBLIC"});if(tab==="pages")void send("pages",{name,description,category});if(tab==="polls")void send("polls",{question,options:options.split(",").map(x=>x.trim())});if(tab==="events")void send("events",{title:name,description,location,startsAt:new Date(startsAt).toISOString()});}
 const lists:Record<Tab,Item[]>={groups,pages,polls,events};
 return <main className="community-shell"><header className="feed-header"><Link href="/" className="feed-brand">Janta<span>Net</span></Link><nav><Link href="/feed" className="feed-profile">News Feed</Link>　<Link href="/profile" className="feed-profile">Profile</Link></nav></header><section className="community-content"><p className="eyebrow">BUILD YOUR COMMUNITY</p><h1>Community Hub</h1><p className="community-lead">Discover groups, follow pages, vote in polls and join events.</p>
 <div className="community-tabs">{(["groups","pages","polls","events"] as Tab[]).map(t=><button key={t} className={tab===t?"active":""} onClick={()=>setTab(t)}>{t[0].toUpperCase()+t.slice(1)}</button>)}</div>
 <form className="composer community-form" onSubmit={submit}><h2>Create {tab.slice(0,-1)}</h2>
 {tab==="groups"||tab==="pages"||tab==="events"? <><label>{tab==="events"?"Event title":"Name"}<input required value={name} onChange={e=>setName(e.target.value)} maxLength={120}/></label><label>Description<textarea required value={description} onChange={e=>setDescription(e.target.value)} maxLength={2000}/></label></>:null}
 {tab==="pages"?<label>Category<input required value={category} onChange={e=>setCategory(e.target.value)}/></label>:null}
 {tab==="polls"?<><label>Question<input required value={question} onChange={e=>setQuestion(e.target.value)} maxLength={300}/></label><label>Options (comma separated)<input required value={options} onChange={e=>setOptions(e.target.value)}/></label></>:null}
 {tab==="events"?<><label>Location<input required value={location} onChange={e=>setLocation(e.target.value)}/></label><label>Date & time<input required type="datetime-local" value={startsAt} onChange={e=>setStartsAt(e.target.value)}/></label></>:null}
 <button disabled={busy}>{busy?"Saving...":"Create"}</button></form>
 {error&&<p className="feed-error" role="alert">{error}</p>}
 <div className="community-list">{lists[tab].map(item=><article className="post-card" key={item.id}>
 <h3>{item.name||item.title||item.question}</h3>{item.description&&<p>{item.description}</p>}
 {tab==="groups"&&<><small>{item._count?.members||0} members · {item.privacy}</small><button onClick={()=>void send("groups/"+item.id+"/join",{})}>{item.isMember?"Leave group":"Join group"}</button></>}
 {tab==="pages"&&<><small>{item.category} · {item._count?.followers||0} followers</small><button onClick={()=>void send("pages/"+item.id+"/follow",{})}>{item.isFollowing?"Unfollow":"Follow page"}</button></>}
 {tab==="polls"&&item.options?.map(o=><div className="poll-option" key={o.id}><span>{o.text} · {o._count.votes} votes</span><button disabled={o.votedByMe} onClick={()=>void send("polls/"+item.id+"/vote",{optionId:o.id})}>{o.votedByMe?"Voted":"Vote"}</button></div>)}
 {tab==="events"&&<><p>{item.location} · {item.startsAt?new Date(item.startsAt).toLocaleString():""}</p><small>{item._count?.attendees||0} attending</small><button onClick={()=>void send("events/"+item.id+"/attend",{})}>{item.isAttending?"Cancel attendance":"I'm attending"}</button></>}
 </article>)}{!lists[tab].length&&<div className="empty-feed">No {tab} yet. Create the first one.</div>}</div>
 </section></main>;
}
