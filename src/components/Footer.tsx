export function Footer() {
  const scrollToOffer = () => {
    document.getElementById('offer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className="border-t border-gray-200 py-8 px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">© Luis — Web Design</div>
        <div className="flex items-center gap-2 text-sm">
          <a href="mailto:you@domain.com" className="text-gray-600 hover:text-blue-600 transition-colors">
            you@domain.com
          </a>
          <span className="text-gray-400">•</span>
          <button
            onClick={scrollToOffer}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Get Free Preview
          </button>
        </div>
      </div>
    </footer>
  );
}
