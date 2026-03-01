const Card = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg p-6 ${
        hover ? 'transition-all duration-300 hover:shadow-2xl hover:-translate-y-1' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
