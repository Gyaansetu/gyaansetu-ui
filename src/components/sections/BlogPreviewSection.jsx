import SectionWrapper from '../layout/SectionWrapper';
import Card from '../ui/Card';

const BlogPreviewSection = () => {
  const articles = [
    {
      title: 'How to Choose the Right Home Tutor',
      excerpt: 'Essential factors to consider when selecting a home tutor for your child, including qualifications, teaching style, and compatibility.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop',
      category: 'Parents Guide',
      readTime: '5 min read',
      date: 'Feb 8, 2026',
    },
    {
      title: 'Benefits of One-on-One Learning',
      excerpt: 'Discover why personalized attention from a home tutor can significantly improve your child\'s academic performance and confidence.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
      category: 'Education',
      readTime: '4 min read',
      date: 'Feb 5, 2026',
    },
    {
      title: 'Common Mistakes Parents Make While Hiring Tutors',
      excerpt: 'Avoid these pitfalls when searching for a home tutor. Learn from experienced parents and make informed decisions.',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=250&fit=crop',
      category: 'Tips & Tricks',
      readTime: '6 min read',
      date: 'Feb 1, 2026',
    },
  ];

  return (
    <SectionWrapper background="gray" className="py-16 md:py-20" id="resources">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Education Tips & Resources
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Expert advice and insights to help you make the best educational choices
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <Card key={index} hover className="overflow-hidden p-0">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute top-4 left-4 px-3 py-1 bg-primary-600 text-white text-sm font-semibold rounded-full">
                {article.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary-600 transition-colors cursor-pointer">
                {article.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {article.excerpt}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{article.date}</span>
                <span>{article.readTime}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <button className="text-primary-600 font-semibold hover:text-primary-700 transition-colors inline-flex items-center gap-2">
          View All Articles
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </SectionWrapper>
  );
};

export default BlogPreviewSection;
