import { useEffect, useState, type FormEvent } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import type {
  ContactACF,
  InquiryTopic,
  Language,
  UIStrings,
} from '../types/cms';
import {
  pickText,
  validateContactForm,
  type ContactValidationErrors,
} from '../utils/portfolio';
import { RevealSection } from './RevealSection';

interface ContactProps {
  contact: ContactACF;
  formStrings: UIStrings['contactForm'];
  lang: Language;
  selectedTopic: InquiryTopic;
  onChangeTopic: (topic: InquiryTopic) => void;
  prefilledMessage: string;
}

const TOPICS: readonly InquiryTopic[] = [
  'workshop-adult',
  'workshop-kids',
  'general',
  'commission',
] as const;

export function Contact({
  contact,
  formStrings,
  lang,
  selectedTopic,
  onChangeTopic,
  prefilledMessage,
}: ContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<ContactValidationErrors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (prefilledMessage) {
      setMessage(prefilledMessage);
      setSubmitted(false);
    }
  }, [prefilledMessage]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateContactForm({
      name,
      email,
      topic: selectedTopic,
      message,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setErrors({});
    setSubmitted(false);
  };

  return (
    <RevealSection
      id="contact"
      ariaLabelledBy="contact-heading"
      className="py-20 sm:py-28 lg:py-32"
    >
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Studio Details & Social Links */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <h2
                id="contact-heading"
                className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-espresso"
              >
                {pickText(contact.sectionTitle, lang)}
              </h2>
              <p className="text-[15px] sm:text-base leading-[1.75] text-umber max-w-[46ch]">
                {pickText(contact.intro, lang)}
              </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-clay-line text-sm">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.12em] text-terracotta font-medium">
                  {pickText(contact.studioCity, lang)}
                </p>
                <p className="text-espresso">{contact.studioAddress}</p>
                <p className="text-umber">{pickText(contact.studioHours, lang)}</p>
              </div>

              <div>
                <a
                  href={`mailto:${contact.email}`}
                  className="font-serif text-2xl text-espresso hover:text-terracotta transition-colors underline decoration-clay-line underline-offset-4"
                >
                  {contact.email}
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                {contact.socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-espresso hover:text-terracotta transition-colors"
                  >
                    <span>{social.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Editorial Contact Form */}
          <div className="lg:col-span-7 bg-cream/65 border border-clay-line p-7 sm:p-10 lg:p-12">
            {submitted ? (
              <div
                data-testid="contact-success"
                role="status"
                className="py-10 space-y-5"
              >
                <div className="inline-flex items-center gap-2 text-terracotta">
                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  <span className="text-xs uppercase tracking-[0.14em] font-medium">
                    KETMADE
                  </span>
                </div>
                <h3 className="font-serif text-3xl text-espresso">
                  {pickText(formStrings.successTitle, lang)}
                </h3>
                <p className="text-[15px] leading-relaxed text-umber max-w-md">
                  {pickText(formStrings.successBody, lang)}
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-2 px-5 py-3 border border-espresso text-sm font-medium text-espresso hover:bg-espresso hover:text-milk transition-colors cursor-pointer"
                >
                  {pickText(formStrings.sendAnother, lang)}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="contact-name"
                      className="block text-xs uppercase tracking-[0.12em] text-umber font-medium"
                    >
                      {pickText(formStrings.nameLabel, lang)}
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) {
                          setErrors((prev) => ({ ...prev, name: undefined }));
                        }
                      }}
                      placeholder={pickText(formStrings.namePlaceholder, lang)}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={
                        errors.name ? 'contact-name-error' : undefined
                      }
                      className="w-full px-4 py-3 bg-milk border border-clay-line text-espresso placeholder:text-umber/55 focus:outline-none focus:border-terracotta transition-colors"
                    />
                    {errors.name && (
                      <p
                        id="contact-name-error"
                        className="text-xs text-terracotta-dark font-medium"
                      >
                        {pickText(formStrings.errors[errors.name], lang)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="contact-email"
                      className="block text-xs uppercase tracking-[0.12em] text-umber font-medium"
                    >
                      {pickText(formStrings.emailLabel, lang)}
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) {
                          setErrors((prev) => ({ ...prev, email: undefined }));
                        }
                      }}
                      placeholder={pickText(formStrings.emailPlaceholder, lang)}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? 'contact-email-error' : undefined
                      }
                      className="w-full px-4 py-3 bg-milk border border-clay-line text-espresso placeholder:text-umber/55 focus:outline-none focus:border-terracotta transition-colors"
                    />
                    {errors.email && (
                      <p
                        id="contact-email-error"
                        className="text-xs text-terracotta-dark font-medium"
                      >
                        {pickText(formStrings.errors[errors.email], lang)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="contact-topic"
                    className="block text-xs uppercase tracking-[0.12em] text-umber font-medium"
                  >
                    {pickText(formStrings.topicLabel, lang)}
                  </label>
                  <select
                    id="contact-topic"
                    name="topic"
                    value={selectedTopic}
                    onChange={(e) =>
                      onChangeTopic(e.target.value as InquiryTopic)
                    }
                    className="w-full px-4 py-3 bg-milk border border-clay-line text-espresso focus:outline-none focus:border-terracotta transition-colors cursor-pointer"
                  >
                    {TOPICS.map((topicKey) => (
                      <option key={topicKey} value={topicKey}>
                        {pickText(formStrings.topics[topicKey], lang)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="contact-message"
                    className="block text-xs uppercase tracking-[0.12em] text-umber font-medium"
                  >
                    {pickText(formStrings.messageLabel, lang)}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) {
                        setErrors((prev) => ({ ...prev, message: undefined }));
                      }
                    }}
                    placeholder={pickText(formStrings.messagePlaceholder, lang)}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                      errors.message ? 'contact-message-error' : undefined
                    }
                    className="w-full px-4 py-3 bg-milk border border-clay-line text-espresso placeholder:text-umber/55 focus:outline-none focus:border-terracotta transition-colors resize-y"
                  />
                  {errors.message && (
                    <p
                      id="contact-message-error"
                      className="text-xs text-terracotta-dark font-medium"
                    >
                      {pickText(formStrings.errors[errors.message], lang)}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-7 py-3.5 bg-espresso text-milk text-sm font-medium tracking-wide hover:bg-terracotta transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                >
                  {pickText(formStrings.submitButton, lang)}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
