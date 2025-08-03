import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Akıllı Notlar. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
