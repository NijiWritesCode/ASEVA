import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import { bookingSchema } from '../../schemas/bookingSchema';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { Select } from '../shared/Select';
import { Textarea } from '../shared/Textarea';
import { enquiryService } from '../../services/enquiryService';
import { 
  ShieldCheck, 
  Info, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Calendar, 
  Users, 
  Sparkles,
  MapPin
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'The Occasion', subtitle: 'Event nature & schedule' },
  { id: 2, title: 'Scale & Budget', subtitle: 'Guest count & investment' },
  { id: 3, title: 'Contact', subtitle: 'Host details' },
  { id: 4, title: 'Vision', subtitle: 'Creative concepts & review' },
];

export function BookingEnquiryForm({
  preselectedServiceId = '',
  preselectedEventType = 'wedding',
  showAdvisory = true,
  className = '',
}) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      eventType: preselectedEventType,
      preferredDate: '',
      alternateDate: '',
      location: 'Lagos Island, Lagos',
      venueName: '',
      guestCount: '101-250',
      estimatedBudget: '₦10,000,000 - ₦25,000,000',
      serviceId: preselectedServiceId,
      visionNotes: '',
      referralSource: 'Instagram',
      _hp: '',
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (preselectedEventType) {
      setValue('eventType', preselectedEventType);
    }
    if (preselectedServiceId) {
      setValue('serviceId', preselectedServiceId);
    }
  }, [preselectedEventType, preselectedServiceId, setValue]);

  // Prevent Enter key in regular input fields from triggering any submission or unexpected action.
  // Clients can freely hit Enter inside textareas for multiline typing.
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
    }
  };

  // Validate only the current step before advancing to the next step
  const handleNextStep = async () => {
    let fieldsToValidate = [];
    if (currentStep === 1) {
      fieldsToValidate = ['eventType', 'preferredDate', 'location'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['guestCount', 'estimatedBudget'];
    } else if (currentStep === 3) {
      fieldsToValidate = ['fullName', 'email', 'phone'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setErrorMessage(null);
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevStep = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // MANUAL SUBMIT ACTION:
  // This function is ONLY executed when the client physically clicks the "Submit Booking Enquiry" button on Step 4.
  const handleManualSubmit = async (values) => {
    if (currentStep !== STEPS.length) {
      // Hard guard: refuse submission if not on the final step
      return;
    }

    if (submitting) return;
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await enquiryService.submitEnquiry(values);
      if (response.success) {
        navigate('/booking-confirmed', {
          state: {
            referenceCode: response.referenceCode,
            clientName: values.fullName,
            eventType: values.eventType,
            preferredDate: values.preferredDate,
          },
        });
      } else {
        throw new Error(response.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Inquiry submission error:', err);
      setErrorMessage(
        err.message || 'We could not submit your enquiry at this time. Please check your network connection.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`w-full max-w-3xl mx-auto space-y-6 ${className}`}>
      {/* Visual Step Progress Bar */}
      <div className="bg-white border border-sand-300 p-6 rounded-sm shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-widest text-gold-600">
            Step {currentStep} of {STEPS.length}
          </span>
          <span className="text-obsidian-600 font-serif font-bold">
            {STEPS[currentStep - 1].title} — <span className="text-obsidian-500 font-sans font-light">{STEPS[currentStep - 1].subtitle}</span>
          </span>
        </div>

        {/* Step Indicators (clickable for completed steps to go back) */}
        <div className="grid grid-cols-4 gap-2">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => isCompleted && setCurrentStep(step.id)}
                className={`text-left space-y-1.5 transition-opacity ${
                  isCompleted ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
                }`}
              >
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gold-500'
                      : isCurrent
                      ? 'bg-obsidian-950'
                      : 'bg-sand-200'
                  }`}
                />
                <div className="hidden sm:flex items-center space-x-1 text-[10px] uppercase tracking-wider">
                  {isCompleted ? (
                    <Check className="w-3 h-3 text-gold-600 shrink-0" />
                  ) : (
                    <span className={`font-mono ${isCurrent ? 'font-bold text-obsidian-950' : 'text-obsidian-400'}`}>
                      0{step.id}
                    </span>
                  )}
                  <span className={`truncate ${isCurrent ? 'font-semibold text-obsidian-950' : 'text-obsidian-500'}`}>
                    {step.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showAdvisory && currentStep === 1 && (
        <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-sm flex items-start text-xs text-amber-900 leading-relaxed">
          <Info className="w-4 h-4 mr-2.5 shrink-0 mt-0.5 text-amber-700" />
          <span>
            <strong>Booking Notice:</strong> Submitting this enquiry is an initial consultation request. Reservations are confirmed following quotation approval and verified deposit receipt.
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-sm text-xs text-rose-800">
          {errorMessage}
        </div>
      )}

      {/* Main Form: Native submit event is intercepted and blocked so it NEVER submits automatically */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        onKeyDown={handleKeyDown}
        className="bg-white border border-sand-300 p-6 sm:p-10 rounded-sm shadow-sm space-y-8"
      >
        {/* Anti-spam honeypot */}
        <input type="text" {...register('_hp')} className="hidden" tabIndex="-1" autoComplete="off" />

        {/* Step-by-Step Transition Views */}
        <AnimatePresence mode="wait">
          {/* STEP 1: The Occasion */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="border-b border-sand-200 pb-3">
                <h3 className="font-serif text-xl font-bold text-obsidian-950">
                  What type of celebration are we curating?
                </h3>
                <p className="text-xs text-obsidian-500 font-light mt-0.5">
                  Select your event category, timeline, and preferred venue.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <Select
                    label="Event Category"
                    required
                    error={errors.eventType}
                    {...register('eventType')}
                  >
                    <option value="wedding">Luxury Nuptials / Wedding</option>
                    <option value="corporate">Executive Corporate Gala / Summit</option>
                    <option value="social">Milestone Jubilee / Birthday / Anniversary</option>
                    <option value="styling">Spatial Floral & Decor Styling Only</option>
                    <option value="other">Bespoke Private Gathering</option>
                  </Select>
                </div>

                <Input
                  label="Preferred Event Date"
                  type="date"
                  required
                  error={errors.preferredDate}
                  {...register('preferredDate')}
                />

                <Input
                  label="Alternate Date (Optional)"
                  type="date"
                  helperText="In case our atelier is fully booked."
                  {...register('alternateDate')}
                />

                <Input
                  label="Event City / Region"
                  required
                  placeholder="e.g. Victoria Island, Lagos or Abuja"
                  error={errors.location}
                  {...register('location')}
                />

                <Input
                  label="Secured Venue (if any)"
                  placeholder="e.g. The Monarch, Eko Hotel, Private Residence"
                  helperText="Leave empty if you need venue sourcing."
                  {...register('venueName')}
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: Scale & Budget */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="border-b border-sand-200 pb-3">
                <h3 className="font-serif text-xl font-bold text-obsidian-950">
                  Attendance scale & investment benchmark
                </h3>
                <p className="text-xs text-obsidian-500 font-light mt-0.5">
                  Helps our directors calculate spatial layout, catering ratios, and production team size.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Select
                  label="Estimated Guest Attendance"
                  required
                  error={errors.guestCount}
                  {...register('guestCount')}
                >
                  <option value="50-100">50 – 100 Guests (Intimate Gathering)</option>
                  <option value="101-250">101 – 250 Guests (Standard Gala)</option>
                  <option value="251-500">251 – 500 Guests (Grand Nuptials)</option>
                  <option value="500+">500+ Guests (Royal / Chieftaincy Production)</option>
                </Select>

                <Select
                  label="Target Budget Bracket (NGN)"
                  required
                  error={errors.estimatedBudget}
                  {...register('estimatedBudget')}
                >
                  <option value="₦5,000,000 - ₦10,000,000">₦5,000,000 – ₦10,000,000</option>
                  <option value="₦10,000,000 - ₦25,000,000">₦10,000,000 – ₦25,000,000</option>
                  <option value="₦25,000,000 - ₦50,000,000">₦25,000,000 – ₦50,000,000</option>
                  <option value="₦50,000,000+">₦50,000,000+ (High-Stakes Production)</option>
                </Select>

                <div className="sm:col-span-2">
                  <Select
                    label="How did you discover ASEVA?"
                    {...register('referralSource')}
                  >
                    <option value="Instagram">Instagram Portfolio Showcase</option>
                    <option value="Attended Past Event">Attended a Past ASEVA Production</option>
                    <option value="Personal Referral">Personal Referral / Word of Mouth</option>
                    <option value="Corporate Partnership">Corporate Partner / Press</option>
                    <option value="Other">Other Referral</option>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Contact Coordinates */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="border-b border-sand-200 pb-3">
                <h3 className="font-serif text-xl font-bold text-obsidian-950">
                  How may our concierge correspond with you?
                </h3>
                <p className="text-xs text-obsidian-500 font-light mt-0.5">
                  We maintain strict client confidentiality. No marketing spam.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <Input
                    label="Full Name & Title"
                    required
                    placeholder="e.g. Chief / Dr / Mrs. Zainab Balogun"
                    error={errors.fullName}
                    {...register('fullName')}
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="e.g. client@example.com"
                  error={errors.email}
                  {...register('email')}
                />

                <Input
                  label="Telephone & WhatsApp Number"
                  type="tel"
                  required
                  placeholder="+234 800 000 0000"
                  helperText="Preferred for quick consultation coordination."
                  error={errors.phone}
                  {...register('phone')}
                />
              </div>
            </motion.div>
          )}

          {/* STEP 4: Creative Vision, Extra Details & Review */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="border-b border-sand-200 pb-3">
                <h3 className="font-serif text-xl font-bold text-obsidian-950">
                  Creative vision & review
                </h3>
                <p className="text-xs text-obsidian-500 font-light mt-0.5">
                  Share your aesthetic aspirations, add any extra details, and review your parameters before submission.
                </p>
              </div>

              {/* Quick Summary Pill Box */}
              <div className="bg-sand-50 border border-sand-300 p-4 rounded-sm grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-obsidian-500 block">Occasion</span>
                  <span className="font-bold text-obsidian-950 capitalize">{watchedValues.eventType}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-obsidian-500 block">Target Date</span>
                  <span className="font-bold text-obsidian-950">{watchedValues.preferredDate || '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-obsidian-500 block">Guests</span>
                  <span className="font-bold text-obsidian-950">{watchedValues.guestCount}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-obsidian-500 block">Host Name</span>
                  <span className="font-bold text-obsidian-950 truncate block">{watchedValues.fullName || '—'}</span>
                </div>
              </div>

              {/* Extra Detail Section: Vision Notes Textarea */}
              <Textarea
                label="Tell us about your creative vision, extra details & ceremonies (Optional)"
                rows={4}
                placeholder="Share any aesthetic inspirations (e.g. glasshouse pavilion, warm champagne accents), cultural traditions (e.g. Traditional & White wedding dual program), entertainment wishes, or specific logistics..."
                {...register('visionNotes')}
              />

              <div className="flex items-center text-xs text-obsidian-600 font-light">
                <ShieldCheck className="w-4 h-4 mr-1.5 text-gold-600 shrink-0" />
                <span>Strict privacy and client discretion assured.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Navigation Controls */}
        <div className="pt-6 border-t border-sand-200 flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handlePrevStep}
              disabled={submitting}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Back</span>
            </Button>
          ) : (
            <div />
          )}

          {currentStep < STEPS.length ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleNextStep}
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="gold"
              size="lg"
              loading={submitting}
              onClick={handleSubmit(handleManualSubmit)}
              className="px-8"
            >
              <span>Submit Booking Enquiry</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
