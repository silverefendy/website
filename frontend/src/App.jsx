import { Link, Route, Routes } from 'react-router-dom';
import { SITE_NAME, SITE_TAGLINE, SUPPORT_EMAIL, formatPrice } from './config/constants';

const HomePage = () => (
  <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
    <header className="flex items-center justify-between border-b border-slate-200 pb-6">
      <Link to="/" className="text-2xl font-bold text-primary-700">
        {SITE_NAME}
      </Link>
      <a className="text-sm font-medium text-slate-600 hover:text-primary-700" href={`mailto:${SUPPORT_EMAIL}`}>
        {SUPPORT_EMAIL}
      </a>
    </header>

    <section className="grid flex-1 place-items-center py-16 text-center">
      <div className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary-600">Marketplace Platform</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">{SITE_NAME}</h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">{SITE_TAGLINE}</p>
        <div className="mt-10 rounded-2xl bg-primary-50 px-6 py-5 text-primary-900 ring-1 ring-primary-100">
          Example price format: <span className="font-bold">{formatPrice(150000)}</span>
        </div>
      </div>
    </section>
  </main>
);

const LoginPage = () => (
  <main className="grid min-h-screen place-items-center bg-slate-50 px-6">
    <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h1 className="text-2xl font-bold text-slate-950">Login</h1>
      <p className="mt-3 text-slate-600">Authentication screens can be added in the pages folder.</p>
      <Link className="mt-6 inline-flex font-medium text-primary-700 hover:text-primary-800" to="/">
        Back to home
      </Link>
    </section>
  </main>
);

const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
  </Routes>
);

export default App;
