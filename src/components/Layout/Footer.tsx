import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Home,
  FileText,
  Users,
  CheckSquare,
  Calendar
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'richieste', label: 'Richieste', icon: FileText },
    { id: 'clienti', label: 'Clienti', icon: Users },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
    { id: 'conversazioni', label: 'Conversazioni', icon: MessageCircle },
    { id: 'calendario', label: 'Calendario', icon: Calendar }
  ];

  const contactInfo = {
    phone: '+39 123 456 7890',
    email: 'info@assistenteidraulico.it',
    address: 'Via Roma 123, 20100 Milano, Italia'
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com', color: 'hover:text-blue-600 dark:hover:text-blue-400' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com', color: 'hover:text-pink-600 dark:hover:text-pink-400' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com', color: 'hover:text-blue-700 dark:hover:text-blue-500' },
    { name: 'WhatsApp', icon: MessageCircle, url: `https://wa.me/${contactInfo.phone.replace(/\s/g, '')}`, color: 'hover:text-green-600 dark:hover:text-green-400' }
  ];

  const legalLinks = [
    { label: 'Privacy Policy', id: 'privacy' },
    { label: 'Termini di Servizio', id: 'terms' },
    { label: 'Cookie Policy', id: 'cookies' }
  ];

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Sezione Azienda */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src="/Logo.png"
                alt="Logo"
                className="h-8 w-auto dark:hidden"
              />
              <img
                src="/Logo-dark.png"
                alt="Logo"
                className="h-8 w-auto hidden dark:block"
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              La soluzione professionale per la gestione completa della tua impresa.
              Organizza richieste, clienti e attività in un unico posto.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-500 dark:text-gray-400 ${social.color} transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1`}
                    aria-label={social.name}
                    title={social.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Sezione Link Rapidi */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Link Rapidi
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <li key={link.id}>
                    <button
                      onClick={() => {
                        const event = new CustomEvent('footer-nav', { detail: { tab: link.id } });
                        window.dispatchEvent(event);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{link.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Sezione Contatti */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Contatti
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-start space-x-3 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                >
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{contactInfo.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-start space-x-3 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                >
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="break-all">{contactInfo.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(contactInfo.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-3 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                >
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{contactInfo.address}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Sezione Supporto e Risorse */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Supporto
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    const event = new CustomEvent('footer-nav', { detail: { tab: 'centro-assistenza' } });
                    window.dispatchEvent(event);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                >
                  Centro Assistenza
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const event = new CustomEvent('footer-nav', { detail: { tab: 'faq' } });
                    window.dispatchEvent(event);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const event = new CustomEvent('footer-nav', { detail: { tab: 'guide-tutorial' } });
                    window.dispatchEvent(event);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                >
                  Guide e Tutorial
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Divisore */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">

            {/* Copyright */}
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
              © {currentYear} Assistente Idraulico. Tutti i diritti riservati.
            </div>

            {/* Link Legali */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.label}>
                  {link.id ? (
                    <button
                      onClick={() => {
                        const event = new CustomEvent('footer-nav', { detail: { tab: link.id } });
                        window.dispatchEvent(event);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <a
                      href={link.url}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                    >
                      {link.label}
                    </a>
                  )}
                  {index < legalLinks.length - 1 && (
                    <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
