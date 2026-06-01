export const Footer = () => {
  return (
    <footer className="border-t border-white/10 glass-panel py-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h2 className="text-xl font-bold text-white neon-text">VANGUARD</h2>
          <p className="text-gray-400 text-sm mt-1">X RPL 2 - SMKN 1 PACITAN</p>
        </div>
        <div className="flex space-x-6 text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Vanguard Class. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
