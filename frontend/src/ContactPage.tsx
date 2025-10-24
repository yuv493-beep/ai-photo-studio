import React, { useState } from 'react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      console.log({ name, email, message });
    }, 1000);
  };

  if (isSubmitted) {
    return (
        <main className="flex-grow flex flex-col justify-center items-center p-4 animate-fade-in text-center">
            <div className="bg-brand-surface p-8 rounded-lg border border-brand-border max-w-md w-full">
                <h1 className="text-2xl font-serif font-bold text-brand-text-primary">Thank You!</h1>
                <p className="text-brand-text-secondary mt-2">Your message has been sent. We'll get back to you shortly.</p>
            </div>
        </main>
    )
  }

  return (
    <main className="flex-grow flex flex-col items-center p-4 animate-fade-in">
      <div className="container mx-auto text-center py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-text-primary max-w-2xl mx-auto leading-tight">
          Get in Touch
        </h1>
        <p className="text-lg text-brand-text-secondary mt-4 max-w-xl mx-auto">
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>
      <div className="container mx-auto px-4 pb-12 max-w-lg w-full">
        <div className="bg-brand-surface p-6 rounded-lg border border-brand-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-brand-text-secondary mb-1">Full Name</label>
              <input 
                type="text" 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 text-sm rounded-md border border-brand-border focus:ring-1 focus:ring-brand-accent focus:outline-none transition bg-brand-bg"
                placeholder="Your Name"
              />
            </div>
             <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-text-secondary mb-1">Email Address</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 text-sm rounded-md border border-brand-border focus:ring-1 focus:ring-brand-accent focus:outline-none transition bg-brand-bg"
                placeholder="you@example.com"
              />
            </div>
             <div>
              <label htmlFor="message" className="block text-sm font-medium text-brand-text-secondary mb-1">Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full p-2 text-sm rounded-md border border-brand-border focus:ring-1 focus:ring-brand-accent focus:outline-none transition bg-brand-bg"
                placeholder="How can we help you?"
                rows={4}
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-brand-accent text-white font-bold py-2.5 px-4 rounded-md hover:opacity-90 transition-all disabled:bg-brand-text-secondary/50 flex items-center justify-center min-h-[44px]"
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
