"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  MessageCircle,
  Phone,
  ShoppingBag,
  Wrench,
  Headphones,
  Building2,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Copy,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

import { useStore } from "../../components/StoreProvider";
import {
  makeId,
  readLocal,
  whatsappLink,
  writeLocal,
} from "../../lib/storage";

import "./inquiry.css";

function InquiryForm() {
  const params = useSearchParams();
  const { site = {}, profile = {}, ready } = useStore();

  const productParam = params.get("product") || "";
  const serviceParam = params.get("service") || "";
  const initialSubject = serviceParam || productParam;

  const [form, setForm] = useState({
    name: profile?.name || "",
    phone: profile?.phone || "",
    type: serviceParam
      ? "Service request"
      : productParam
      ? "Product enquiry"
      : "Product enquiry",
    subject: initialSubject,
    message: "",
  });

  const [opened, setOpened] = useState(false);
  const [reference, setReference] = useState("");
  const [formError, setFormError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!ready) return;

    setForm((current) => ({
      ...current,
      name: current.name || profile?.name || "",
      phone: current.phone || profile?.phone || "",
    }));
  }, [ready, profile]);

  function change(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setFormError("");
  }

  function chooseType(type) {
    setForm((current) => ({ ...current, type }));
    setFormError("");
  }

  function submit(event) {
    event.preventDefault();

    if (opened) return;

    const cleanedPhone = form.phone.trim();
    const digits = cleanedPhone.replace(/\D/g, "");

    if (digits.length < 8 || digits.length > 15) {
      setFormError("Please enter a valid phone number.");
      return;
    }

    if (!form.message.trim()) {
      setFormError("Please describe your requirement.");
      return;
    }

    const enquiry = {
      id: makeId("ENQ"),
      createdAt: new Date().toISOString(),
      name: form.name.trim(),
      phone: cleanedPhone,
      type: form.type,
      subject: form.subject.trim(),
      message: form.message.trim(),
      status: "New",
    };

    try {
      const existing = readLocal("kgn_enquiries", []);
      writeLocal("kgn_enquiries", [
        enquiry,
        ...(Array.isArray(existing) ? existing : []),
      ]);
    } catch {
      setFormError(
        "We couldn't save this enquiry in your browser. Please try again or contact the shop directly."
      );
      return;
    }

    setReference(enquiry.id);
    setOpened(true);

    if (site.whatsapp) {
      const whatsappMessage = [
        `*Enquiry — ${site.name || "KGN Computer & Services"}*`,
        `Reference: ${enquiry.id}`,
        "",
        `Name: ${enquiry.name}`,
        `Phone: ${enquiry.phone}`,
        `Type: ${enquiry.type}`,
        `Requirement: ${enquiry.subject || "Not specified"}`,
        "",
        "Details:",
        enquiry.message,
      ].join("\n");

      const url = whatsappLink(site.whatsapp, whatsappMessage);
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function resetForm() {
    setForm({
      name: profile?.name || "",
      phone: profile?.phone || "",
      type: "Product enquiry",
      subject: "",
      message: "",
    });

    setOpened(false);
    setReference("");
    setFormError("");
    setCopied(false);
  }

  const enquiryTypes = [
    {
      id: "Product enquiry",
      title: "Products",
      description: "Prices, stock and recommendations",
      icon: ShoppingBag,
    },
    {
      id: "Service request",
      title: "Repair & service",
      description: "Repairs, installation and setup",
      icon: Wrench,
    },
    {
      id: "Technical support",
      title: "Technical support",
      description: "Troubleshooting and software help",
      icon: Headphones,
    },
    {
      id: "Bulk / business order",
      title: "Business / bulk",
      description: "Bulk purchases and business needs",
      icon: Building2,
    },
  ];

  const phoneDigits = String(site.phone || "").replace(/[^\d+]/g, "");

  return (
    <section className="section inquiry-page">
      <div className="container inquiry-layout">
        <aside className="inquiry-intro">
          <span className="eyebrow">LET'S TALK TECH</span>
          <h1>Tell us what you need.</h1>
          <p>
            Share your product requirement, repair issue or business needs.
            We’ll help you understand the next step.
          </p>

          <div className="inquiry-benefits">
            <div className="inquiry-benefit">
              <span>01</span>
              <div>
                <strong>Choose your enquiry</strong>
                <p>Select the category that best matches your requirement.</p>
              </div>
            </div>

            <div className="inquiry-benefit">
              <span>02</span>
              <div>
                <strong>Explain the details</strong>
                <p>Include the product, model, issue or budget if relevant.</p>
              </div>
            </div>

            <div className="inquiry-benefit">
              <span>03</span>
              <div>
                <strong>Continue the conversation</strong>
                <p>
                  {site.whatsapp
                    ? "Review your prepared message and press Send in WhatsApp."
                    : "Use the reference ID and call the shop to follow up."}
                </p>
              </div>
            </div>
          </div>

          <div className="inquiry-side-help">
            <ShieldCheck size={20} />
            <div>
              <strong>Clear next steps</strong>
              <p>Confirm availability, pricing and timing before proceeding.</p>
            </div>
          </div>

          {site.phone && (
            <a className="inquiry-call-link" href={`tel:${phoneDigits}`}>
              <Phone size={17} />
              Need help now? Call {site.phone}
              <ArrowRight size={16} />
            </a>
          )}
        </aside>

        <div className="inquiry-form-wrap">
          {opened ? (
            <div className="inquiry-success-card" role="status">
              <span className="inquiry-success-icon">
                <CheckCircle2 size={35} />
              </span>

              <span className="eyebrow">ENQUIRY PREPARED</span>
              <h2>Your enquiry is saved on this device.</h2>
              <p>
                Keep your reference ID for follow-up. Saving locally does not
                automatically notify the shop.
              </p>

              <div className="inquiry-reference">
                <div>
                  <small>REFERENCE ID</small>
                  <strong>{reference}</strong>
                </div>
                <button type="button" onClick={copyReference}>
                  {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  {copied ? "Copied" : "Copy ID"}
                </button>
              </div>

              {site.whatsapp ? (
                <div className="inquiry-success-whatsapp">
                  <MessageCircle size={20} />
                  <div>
                    <strong>Continue on WhatsApp</strong>
                    <p>
                      If WhatsApp did not open, use the button below. You
                      still need to press Send in WhatsApp.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="inquiry-success-whatsapp">
                  <Phone size={20} />
                  <div>
                    <strong>Contact the shop directly</strong>
                    <p>
                      Your enquiry has not been delivered automatically.
                      Call the shop to discuss it.
                    </p>
                  </div>
                </div>
              )}

              <div className="inquiry-success-actions">
                {site.whatsapp && (
                  <a
                    className="button button-whatsapp"
                    href={whatsappLink(
                      site.whatsapp,
                      [
                        `*Enquiry — ${site.name || "KGN Computer & Services"}*`,
                        `Reference: ${reference}`,
                        `Name: ${form.name}`,
                        `Phone: ${form.phone}`,
                        `Type: ${form.type}`,
                        `Requirement: ${form.subject || "Not specified"}`,
                        "",
                        `Details: ${form.message}`,
                      ].join("\n")
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle size={18} />
                    Open WhatsApp
                  </a>
                )}

                {!site.whatsapp && site.phone && (
                  <a className="button" href={`tel:${phoneDigits}`}>
                    <Phone size={18} /> Call the shop
                  </a>
                )}

                <button
                  type="button"
                  className="button button-outline"
                  onClick={resetForm}
                >
                  <RotateCcw size={17} /> New enquiry
                </button>
              </div>

              <small className="inquiry-disclaimer">
                Enquiries are stored in this browser only. Clearing browser
                data may remove them.
              </small>
            </div>
          ) : (
            <form className="checkout-card inquiry-form" onSubmit={submit}>
              <div className="inquiry-form-title">
                <div>
                  <span className="eyebrow">STEP 1 · YOUR REQUIREMENT</span>
                  <h2>Send an enquiry</h2>
                  <p>Choose a category to get started.</p>
                </div>
                <span className="inquiry-form-title-icon">
                  <ClipboardList size={23} />
                </span>
              </div>

              <div className="inquiry-type-grid">
                {enquiryTypes.map((item) => {
                  const Icon = item.icon;
                  const active = form.type === item.id;

                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={
                        active
                          ? "inquiry-type-card active"
                          : "inquiry-type-card"
                      }
                      onClick={() => chooseType(item.id)}
                      aria-pressed={active}
                    >
                      <Icon size={21} />
                      <span>
                        <strong>{item.title}</strong>
                        <small>{item.description}</small>
                      </span>
                      {active && <CheckCircle2 size={17} />}
                    </button>
                  );
                })}
              </div>

              <div className="inquiry-form-divider" />

              <div className="inquiry-fields-heading">
                <span className="eyebrow">STEP 2 · YOUR DETAILS</span>
              </div>

              <label>
                Your name *
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={change}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  maxLength={100}
                />
              </label>

              <label>
                Phone number *
                <input
                  required
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={change}
                  placeholder="Enter your contact number"
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={18}
                />
                <small className="inquiry-field-hint">
                  Include your country code if needed.
                </small>
              </label>

              <label>
                Enquiry type
                <select name="type" value={form.type} onChange={change}>
                  {enquiryTypes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.id}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </label>

              <label>
                Product or service
                <input
                  name="subject"
                  value={form.subject}
                  onChange={change}
                  placeholder="Product name, service or model"
                  maxLength={180}
                />
              </label>

              <label>
                Tell us more *
                <textarea
                  required
                  name="message"
                  value={form.message}
                  onChange={change}
                  placeholder="Describe your requirement, budget, model, issue or preferred timing..."
                  rows={5}
                  maxLength={2000}
                />
                <small className="inquiry-character-count">
                  {form.message.length}/2000 characters
                </small>
              </label>

              {formError && (
                <p className="inquiry-error" role="alert">
                  {formError}
                </p>
              )}

              <div className="inquiry-preview">
                <span className="inquiry-preview-icon">
                  <MessageCircle size={19} />
                </span>
                <div>
                  <strong>What happens next?</strong>
                  <p>
                    {site.whatsapp
                      ? "Your enquiry will be saved locally and a WhatsApp message will open for you to review and send."
                      : "Your enquiry will be saved locally. Contact the shop directly to follow up."}
                  </p>
                </div>
              </div>

              <button className="button button-full inquiry-submit" type="submit">
                {site.whatsapp ? (
                  <MessageCircle size={18} />
                ) : (
                  <ClipboardList size={18} />
                )}
                {site.whatsapp ? "Save & continue to WhatsApp" : "Save enquiry"}
                <ArrowRight size={17} />
              </button>

              <small className="form-footnote inquiry-form-footnote">
                Your enquiry is stored in this browser, not in a central
                database. It is not delivered to the shop until you contact
                them through WhatsApp, phone or email.
              </small>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default function InquiryPage() {
  return (
    <Suspense
      fallback={<div className="container section">Loading enquiry form…</div>}
    >
      <InquiryForm />
    </Suspense>
  );
}