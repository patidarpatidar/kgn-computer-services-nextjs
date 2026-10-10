"use client";
import { ExternalLink, Star } from "lucide-react";

export default function GoogleReviews({site}) {
  const rating = Number(site.googleRating);
  const reviewCount = Number(site.googleReviewCount);
  const distribution = Array.isArray(site.googleReviewDistribution) ? site.googleReviewDistribution : [];
  const featuredReview = site.googleFeaturedReview;

  if (!Number.isFinite(rating) || !Number.isFinite(reviewCount) || !site.googleReviewsUrl) return null;

  return <section className="section google-reviews-section">
    <div className="container google-reviews-layout">
      <div className="google-reviews-intro">
        <span className="eyebrow">FROM OUR GOOGLE BUSINESS PROFILE</span>
        <h2>Local service, rated by customers.</h2>
        <p>See the latest customer feedback and business details on our live Google listing.</p>
        <a className="button button-outline" href={site.googleReviewsUrl} target="_blank" rel="noopener noreferrer">Read Google reviews <ExternalLink size={16}/></a>
      </div>
      <div className="google-rating-card">
        <div className="google-rating-top"><span className="google-letter">G</span><span>Google rating</span><span className="google-rating-live"><i/> Listing snapshot</span></div>
        <div className="google-rating-summary"><strong>{rating.toFixed(1)}</strong><div><span className="google-stars" aria-label={`${rating.toFixed(1)} out of 5 stars`}>{[1,2,3,4,5].map(star=><Star key={star} size={16} fill={star<=Math.round(rating)?"currentColor":"none"}/>)}</span><small>{reviewCount} Google reviews</small></div></div>
        <div className="google-rating-bars" aria-label="Google review rating breakdown">{[5,4,3,2,1].map(stars=>{const count=Number(distribution[5-stars])||0;return <div key={stars}><span>{stars} star</span><span className="google-rating-track"><i style={{width:`${reviewCount?Math.min(100,count/reviewCount*100):0}%`}}/></span><small>{count}</small></div>})}</div>
        {featuredReview&&<figure className="google-featured-review"><div><span className="google-review-quote-mark" aria-hidden="true">“</span><span className="google-stars" aria-label={`${featuredReview.rating} out of 5 stars`}>{Array.from({length:featuredReview.rating},(_,index)=><Star key={index} size={13} fill="currentColor"/>)}</span></div><blockquote>{featuredReview.text}</blockquote><figcaption>{featuredReview.author} <span>· {featuredReview.age} · Google review</span></figcaption></figure>}
        <a className="google-review-card-link" href={site.googleReviewsUrl} target="_blank" rel="noopener noreferrer">Open the listing to read reviews and leave your own <ExternalLink size={14}/></a>
        <small className="google-rating-note">Rating, review count and excerpt were checked against Google Maps on 10 October 2026. Google may update them.</small>
      </div>
    </div>
  </section>;
}
