import { Link } from 'react-router-dom';
import { SITE_NAME, SITE_TAGLINE, SUPPORT_EMAIL, WHATSAPP_NUMBER, buildWhatsAppUrl } from '../../config/constants';

const Footer = () => (
  <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-slate-200">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 className="text-xl font-bold text-white">{SITE_NAME}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">{SITE_TAGLINE}</p>
      </div>
      <div>
        <h3 className="font-semibold text-white">Quick Links</h3>
        <ul className="mt-4 space-y-2 text-sm text-slate-400">
          <li><Link className="hover:text-white" to="/">Home</Link></li>
          <li><Link className="hover:text-white" to="/products">Products</Link></li>
          <li><Link className="hover:text-white" to="/register?role=seller">Register as Seller</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-white">Contact</h3>
        <ul className="mt-4 space-y-2 text-sm text-slate-400">
          <li><a className="hover:text-white" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></li>
          <li><a className="hover:text-white" href={buildWhatsAppUrl()} target="_blank" rel="noreferrer">WhatsApp {WHATSAPP_NUMBER}</a></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-slate-800 px-4 py-5 text-center text-sm text-slate-500">
      © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
    </div>
  </footer>
);

export default Footer;
