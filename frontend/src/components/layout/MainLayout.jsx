import Footer from './Footer';
import Navbar from './Navbar';

const MainLayout = ({ children }) => (
  <div className="flex min-h-screen flex-col bg-slate-50">
    <Navbar />
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    <Footer />
  </div>
);

export default MainLayout;
