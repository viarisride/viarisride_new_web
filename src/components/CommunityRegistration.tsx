import { useState } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import '../styles/community-registration.css';

const communityTypes = ['School', 'Workplace', 'Apartments', 'Gated community', 'Other'];

export default function CommunityRegistration() {
  const [communityType, setCommunityType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!communityType || submitting) return;

    if (!supabase) {
      setError('Submission service is not configured. Please try again later.');
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const communityName = String(formData.get('communityName') ?? '').trim();
    const rawPhone = String(formData.get('phone') ?? '').trim();
    const phone = rawPhone.startsWith('+') ? rawPhone : `+91 ${rawPhone}`;
    const email = String(formData.get('email') ?? '').trim();
    const address = String(formData.get('address') ?? '').trim();

    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase
      .from('community_registration_requests')
      .insert({
        community_name: communityName,
        community_type: communityType,
        phone,
        email,
        address,
      });

    setSubmitting(false);

    if (insertError) {
      setError('Could not submit your request. Please check your details and try again.');
      return;
    }

    form.reset();
    setCommunityType('');
    setSubmitted(true);
  }

  return (
    <section className="community-registration" aria-labelledby="community-registration-title">
      <div className="community-registration__inner">
        <div className="community-registration__intro">
          <span className="community-registration__eyebrow"><i /> COMMUNITY PARTNERSHIPS</span>
          <h2 id="community-registration-title">Bring Viaris <em>Ride</em> to your community.</h2>
          <p>Better journeys begin close to home. Tell us a little about your community and let’s explore what travelling together could look like.</p>
          <div className="community-registration__footnote">
            <span>01</span>
            <span>SCHOOLS</span><b>·</b><span>WORKPLACES</span><b>·</b><span>RESIDENTIAL COMMUNITIES</span>
          </div>
        </div>

        <div className="community-registration__form-wrap">
          {submitted ? (
            <div className="community-registration__success" role="status">
              <CheckCircle2 size={28} strokeWidth={1.5} />
              <h3>Thanks for reaching out.</h3>
              <p>We’ve received your community request and our team will reach out shortly.</p>
              <button type="button" onClick={() => setSubmitted(false)}>Back to form</button>
            </div>
          ) : (
            <form className="community-registration__form" onSubmit={handleSubmit}>
              <div className="community-registration__form-heading">
                <span>LET’S GET TO KNOW YOUR COMMUNITY</span>
                <small><i /> REQUIRED FIELDS</small>
              </div>

              <label className="community-registration__field community-registration__field--full">
                <span>Community name <b>*</b></span>
                <input name="communityName" placeholder="e.g. Green Valley Residences" autoComplete="organization" required />
              </label>

              <fieldset className="community-registration__categories">
                <legend>What kind of community is it? <b>*</b></legend>
                <div className="community-registration__category-grid">
                  {communityTypes.map((type) => (
                    <button
                      className={communityType === type ? 'is-selected' : ''}
                      key={type}
                      type="button"
                      aria-pressed={communityType === type}
                      onClick={() => setCommunityType(type)}
                    >{type}</button>
                  ))}
                </div>
                <input type="hidden" name="communityType" value={communityType} />
              </fieldset>

              <div className="community-registration__field-row">
                <label className="community-registration__field">
                  <span>Phone number <b>*</b></span>
                  <div className="community-registration__phone">
                    <span>+91</span>
                    <input name="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="98765 43210" pattern="[0-9 +()-]{8,16}" required />
                  </div>
                </label>
                <label className="community-registration__field">
                  <span>Email address <b>*</b></span>
                  <input name="email" type="email" autoComplete="email" placeholder="you@community.com" required />
                </label>
              </div>

              <label className="community-registration__field community-registration__field--full">
                <span>Community address <b>*</b></span>
                <textarea name="address" autoComplete="street-address" placeholder="Building / area, city, state, PIN code" rows={3} required />
              </label>

              {error && (
                <p className="community-registration__error" role="alert">{error}</p>
              )}

              <div className="community-registration__submit-row">
                <p>Your details will only be used to follow up on this enquiry.</p>
                <button type="submit" disabled={!communityType || submitting}>
                  {submitting ? 'Submitting...' : 'Submit'} <ArrowUpRight size={16} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
