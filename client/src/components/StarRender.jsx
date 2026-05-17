import "./styles/StarRender.css";

const RenderStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;

  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="rating">
      {Array.from({ length: fullStars }).map((_, index) => (
        <span key={`full-${index}`} className="star full">
          ★
        </span>
      ))}
      {halfStar && <span className="star half">★</span>}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <span key={`empty-${index}`} className="star empty">
          ★
        </span>
      ))}
    </div>
  );
};

export default RenderStars;
