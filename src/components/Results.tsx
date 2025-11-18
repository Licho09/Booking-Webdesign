import { TrendingUp } from 'lucide-react';

export function Results() {
  const results = [
    {
      title: 'Local Contractor',
      result: '+42% inbound job requests in 60 days',
    },
    {
      title: 'Architect Studio',
      result: 'New client leads through Google Ads & SEO',
    },
    {
      title: 'Barber Shop',
      result: 'Booking conversions increased 30%',
    },
  ];

  return (
    <section id="results" className="max-w-7xl mx-auto px-8 py-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-8">Real results. Real growth.</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {results.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.result}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
