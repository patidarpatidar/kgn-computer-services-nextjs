"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import { useStore } from "../../components/StoreProvider";
import { makeId, readLocal, whatsappLink, writeLocal } from "../../lib/storage";
function InquiryForm(){
 const params=useSearchParams();
 const {site,profile,ready}=useStore();
 const [form,setForm]=useState({name:profile.name||"",phone:profile.phone||"",type:params.get("service")?"Service request":"Product enquiry",subject:params.get("service")||"",message:""});
 const [opened,setOpened]=useState(false);
 useEffect(()=>{if(ready)setForm(current=>({...current,name:current.name||profile.name||"",phone:current.phone||profile.phone||""}))},[ready,profile]);
 const change=e=>setForm({...form,[e.target.name]:e.target.value});
 const submit=e=>{
  e.preventDefault();
  const enquiry={id:makeId("ENQ"),createdAt:new Date().toISOString(),...form,status:"New"};
  writeLocal("kgn_enquiries",[enquiry,...readLocal("kgn_enquiries",[])]);
  const msg=`*Enquiry — ${site.name}*\nReference: ${enquiry.id}\nName: ${form.name}\nPhone: ${form.phone}\nType: ${form.type}\nRequirement: ${form.subject||"Not specified"}\nDetails: ${form.message}`;
  if(site.whatsapp)window.open(whatsappLink(site.whatsapp,msg),"_blank","noopener,noreferrer");
  setOpened(true);
 };
 return <section className="section"><div className="container form-page-grid"><div className="form-intro"><span className="eyebrow">LET'S TALK TECH</span><h1>How can we help you?</h1><p>Send your requirement. Share the product, budget or issue so we can guide you better.</p><div className="form-benefit"><span>01</span><div><strong>Tell us what you need</strong><p>Product, repair or setup request.</p></div></div><div className="form-benefit"><span>02</span><div><strong>We’ll review your enquiry</strong><p>We can confirm options and availability.</p></div></div><div className="form-benefit"><span>03</span><div><strong>{site.whatsapp?"Continue on WhatsApp":"Call the shop to discuss"}</strong><p>{site.whatsapp?"Review the message and press Send.":"Your enquiry is saved on this device; call us to follow up."}</p></div></div></div><form className="checkout-card inquiry-form" onSubmit={submit}><h2>Send an enquiry</h2><label>Your name *<input required name="name" value={form.name} onChange={change} placeholder="Full name"/></label><label>Phone number *<input required type="tel" name="phone" pattern="[0-9+ ()-]{8,18}" value={form.phone} onChange={change} placeholder="Mobile number"/></label><label>Enquiry type<select name="type" value={form.type} onChange={change}><option>Product enquiry</option><option>Service request</option><option>Bulk / business order</option><option>Technical support</option><option>Other</option></select></label><label>Product / service<input name="subject" value={form.subject} onChange={change} placeholder="What are you looking for?"/></label><label>Tell us more *<textarea required name="message" value={form.message} onChange={change} placeholder="Budget, model, issue or preferred time"/></label><button className={`button ${site.whatsapp?"button-whatsapp":""} button-full`} type="submit" disabled={opened}>{site.whatsapp?<MessageCircle size={18}/>:<Phone size={18}/>} {opened?"Enquiry saved":site.whatsapp?"Continue on WhatsApp":"Save enquiry"}</button>{opened&&<p className="success-note" role="status">{site.whatsapp?"Your enquiry is saved in this browser. WhatsApp opened—review the message and press Send to contact the shop.":<>Your enquiry is saved in this browser. Call the shop to follow up: <a href={`tel:${String(site.phone||"").replace(/[^\d+]/g,"")}`}>{site.phone}</a>.</>}</p>}<small className="form-footnote">{site.whatsapp?"Enquiries are saved locally. Your message is not sent until you press Send in WhatsApp.":"Enquiries are saved in this browser only; the shop does not receive them automatically."}</small></form></div></section>
}
export default function InquiryPage(){return <Suspense fallback={<div className="container section">Loading form…</div>}><InquiryForm/></Suspense>}
