"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  ArrowRight,
  Wrench,
  ShoppingBag,
  Send,
  CheckCircle2,
  Headphones,
  ShieldCheck,
  CalendarClock,
  Copy,
  ExternalLink,
} from "lucide-react";

import { useStore } from "../../components/StoreProvider";
import { whatsappLink } from "../../lib/storage";
import "./contact.css";

export default function ContactPage() {
  const { site = {} } = useStore();

  const [topic, setTopic] = useState("Product enquiry");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [message, setMessage] = useState("");
  const [preferredContact, setPreferredContact] = useState("WhatsApp");
  const [copied, setCopied] = useState(false);

  const phoneDigits = String(site.phone || "").replace(/[^\d+]/g, "");

  const directionsUrl =
    site.googleMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      site.address || site.name || "KGN Computer"
    )}`;

  const contactMessage = [
    `Hello ${site.name || "KGN Computer & Services"},`,
    "",
    "I would like to make an enquiry.",
    `Topic: ${topic}`,
    `Name: ${customerName.trim() || "Not provided"}`,
    `Phone: ${customerPhone.trim() || "Not provided"}`,
    `Preferred contact: ${preferredContact}`,
    "",
    "My requirements:",
    message.trim() || "Please contact me to discuss my requirements.",
  ].join("\n");

  function handleSubmit(event) {
    event.preventDefault();

    if (!site.whatsapp) {
      window.location.href = `tel:${phoneDigits}`;
      return;
    }

    const url = whatsappLink(site.whatsapp, contactMessage);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function copyContactDetails() {
    const details = [
      site.name || "KGN Computer & Services",
      site.address || "",
      site.phone ? `Phone: ${site.phone}` : "",
      site.email ? `Email: ${site.email}` : "",
      site.hours ? `Hours: ${site.hours}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(details);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const contactOptions = [
    {
      icon: ShoppingBag,
      title: "Product enquiry",
      description: "Price, availability or product recommendations",
    },
    {
      icon: Wrench,
      title: "Repair & service",
      description: "Computer issues, repairs or installation",
    },
    {
      icon: Headphones,
      title: "Technical support",
      description: "Setup, software or troubleshooting",
    },
    {
      icon: MessageCircle,
      title: "Other enquiry",
      description: "Business requirements or general questions",
    },
  ];

  return (
    <>
      <section className="page-hero contact-hero">
        <div className="container contact-hero-inner">
          <span className="eyebrow">
            CONTACT {site.shortName || "KGN"}
          </span>

          <h1>Let’s get your tech sorted.</h1>

          <p>
            Need a product, repair or technical support? Tell us what you
            need and choose the easiest way to get in touch.
          </p>

          <div className="contact-hero-actions">
            {site.whatsapp ? (
              <a
                className="button button-whatsapp"
                href={whatsappLink(
                  site.whatsapp,
                  `Hello ${site.name || "KGN Computer & Services"}, I have an enquiry.`
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
                <ExternalLink size={15} />
              </a>
            ) : (
              <a className="button" href={`tel:${phoneDigits}`}>
                <Phone size={18} /> Call the shop
              </a>
            )}

            <a className="button button-outline" href="#contact-form">
              Send an enquiry <ArrowRight size={17} />
            </a>
          </div>

          <div className="contact-hero-trust">
            <span><CheckCircle2 size={16} /> Clear communication</span>
            <span><ShieldCheck size={16} /> Estimate before work</span>
            <span><Clock size={16} /> Check availability first</span>
          </div>
        </div>
      </section>

      <section className="section contact-main-section">
        <div className="container contact-page-grid">
          <div className="contact-form-column" id="contact-form">
            <div className="contact-section-heading">
              <span className="eyebrow">QUICK ENQUIRY</span>
              <h2>How can we help you?</h2>
              <p>
                Fill in the details below. Your enquiry will be prepared as
                a WhatsApp message for you to review and send.
              </p>
            </div>

            <div className="contact-topic-grid">
              {contactOptions.map((option) => {
                const Icon = option.icon;
                const active = topic === option.title;

                return (
                  <button
                    type="button"
                    key={option.title}
                    className={`contact-topic-card ${active ? "active" : ""}`}
                    onClick={() => setTopic(option.title)}
                    aria-pressed={active}
                  >
                    <span className="contact-topic-icon">
                      <Icon size={20} />
                    </span>
                    <span className="contact-topic-copy">
                      <strong>{option.title}</strong>
                      <small>{option.description}</small>
                    </span>
                    {active && (
                      <CheckCircle2
                        className="contact-topic-check"
                        size={18}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <form className="contact-inquiry-form" onSubmit={handleSubmit}>
              <div className="contact-form-heading">
                <div>
                  <span className="eyebrow">YOUR DETAILS</span>
                  <h3>Tell us a little more</h3>
                </div>
                <span className="contact-step-label">Almost there</span>
              </div>

              <div className="contact-form-row">
                <label className="contact-field">
                  <span>Your name</span>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Enter your name"
                    autoComplete="name"
                    maxLength={100}
                  />
                </label>

                <label className="contact-field">
                  <span>Phone number (optional)</span>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(event) => setCustomerPhone(event.target.value)}
                    placeholder="Your contact number"
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={20}
                  />
                </label>
              </div>

              <label className="contact-field">
                <span>What do you need help with?</span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Example: I need a laptop for office work, or my computer is not starting..."
                  rows={5}
                  maxLength={2000}
                />
                <small className="contact-character-count">
                  {message.length}/2000 characters
                </small>
              </label>

              <fieldset className="contact-preference-fieldset">
                <legend>Preferred contact method</legend>
                <div className="contact-preference-options">
                  {["WhatsApp", "Phone call", "Email"].map((option) => (
                    <label
                      key={option}
                      className={
                        preferredContact === option
                          ? "contact-preference active"
                          : "contact-preference"
                      }
                    >
                      <input
                        type="radio"
                        name="preferredContact"
                        value={option}
                        checked={preferredContact === option}
                        onChange={(event) =>
                          setPreferredContact(event.target.value)
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>

              <button className="button contact-submit-button" type="submit">
                {site.whatsapp ? (
                  <>
                    <MessageCircle size={18} />
                    Prepare WhatsApp enquiry
                  </>
                ) : (
                  <>
                    <Phone size={18} />
                    Call the shop
                  </>
                )}
                <ArrowRight size={18} />
              </button>

              <p className="contact-form-privacy">
                <ShieldCheck size={15} />
                No online payment or booking is made by submitting this
                form. Review your message before sending it.
              </p>
            </form>
          </div>

          <aside className="contact-info-column">
            <div className="contact-info-card">
              <span className="eyebrow">CONTACT INFORMATION</span>
              <h2>Reach us directly</h2>
              <p>
                Contact the shop to check product stock, service availability
                or suitable visiting times.
              </p>

              {site.whatsapp && (
                <a
                  className="contact-info-row contact-whatsapp-row"
                  href={whatsappLink(
                    site.whatsapp,
                    `Hello ${site.name || "KGN Computer & Services"}, I would like to enquire about your products and services.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="contact-info-icon">
                    <MessageCircle size={20} />
                  </span>
                  <span>
                    <small>WHATSAPP</small>
                    <strong>Start a conversation</strong>
                    <em>Message the shop <ArrowRight size={13} /></em>
                  </span>
                </a>
              )}

              {site.phone && (
                <a
                  className="contact-info-row"
                  href={`tel:${phoneDigits}`}
                >
                  <span className="contact-info-icon">
                    <Phone size={20} />
                  </span>
                  <span>
                    <small>PHONE</small>
                    <strong>{site.phone}</strong>
                    <em>Tap to call <ArrowRight size={13} /></em>
                  </span>
                </a>
              )}

              {site.email && (
                <a
                  className="contact-info-row"
                  href={`mailto:${site.email}?subject=${encodeURIComponent(
                    `Enquiry for ${site.name || "KGN Computer & Services"}`
                  )}`}
                >
                  <span className="contact-info-icon">
                    <Mail size={20} />
                  </span>
                  <span>
                    <small>EMAIL</small>
                    <strong>{site.email}</strong>
                    <em>Send an email <ArrowRight size={13} /></em>
                  </span>
                </a>
              )}

              <div className="contact-info-row contact-hours-row">
                <span className="contact-info-icon">
                  <Clock size={20} />
                </span>
                <span>
                  <small>BUSINESS HOURS</small>
                  <strong>{site.hours || "Please contact us to confirm"}</strong>
                  <em>Confirm today's availability before visiting.</em>
                </span>
              </div>

              <button
                className="contact-copy-button"
                type="button"
                onClick={copyContactDetails}
              >
                {copied ? (
                  <><CheckCircle2 size={16} /> Details copied</>
                ) : (
                  <><Copy size={16} /> Copy contact details</>
                )}
              </button>
            </div>

            <div className="contact-location-card">
              <div className="contact-location-art">
                <MapPin size={30} />
              </div>
              <span className="eyebrow">FIND OUR LOCATION</span>
              <h3>Planning a visit?</h3>
              <p>
                {site.address ||
                  "Contact us to confirm the shop address before travelling."}
              </p>

              <a
                className="button button-outline contact-directions-button"
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin size={17} /> Get directions
                <ExternalLink size={14} />
              </a>

              <small>
                Directions open a map search. Confirm the exact location
                before travelling.
              </small>
            </div>

            {site.googleReviewsUrl && (
              <a
                className="contact-review-card"
                href={site.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={20} />
                <span>
                  <strong>Find us on Google</strong>
                  <small>
                    {site.businessCategory || "Computer service"}
                    {site.googleRating
                      ? ` · ${site.googleRating} rating`
                      : ""}
                    {site.googleReviewCount != null
                      ? ` · ${site.googleReviewCount} reviews`
                      : ""}
                  </small>
                </span>
                <ArrowRight size={17} />
              </a>
            )}
          </aside>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container contact-shortcuts-section">
          <div className="contact-section-heading">
            <span className="eyebrow">QUICK ACCESS</span>
            <h2>Start with what you need</h2>
            <p>Go directly to products or technical services.</p>
          </div>

          <div className="contact-shortcuts">
            <Link className="contact-shortcut" href="/products">
              <span className="contact-shortcut-icon">
                <ShoppingBag size={21} />
              </span>
              <span>
                <strong>Product advice</strong>
                <small>Explore computers and accessories</small>
              </span>
              <ArrowRight size={18} />
            </Link>

            <Link className="contact-shortcut" href="/services">
              <span className="contact-shortcut-icon">
                <Wrench size={21} />
              </span>
              <span>
                <strong>Repair & support</strong>
                <small>Explore setup and support services</small>
              </span>
              <ArrowRight size={18} />
            </Link>

            <a className="contact-shortcut" href="#contact-form">
              <span className="contact-shortcut-icon">
                <CalendarClock size={21} />
              </span>
              <span>
                <strong>Discuss a requirement</strong>
                <small>Describe what you need help with</small>
              </span>
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}