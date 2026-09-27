import React from 'react'

export function TabNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} slick-nex`}
      style={{ ...style}}
      onClick={onClick}
    >
        <i className="ion-ios-arrow-right"></i>

    </button>
  );
}

export function TabPrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} slick-prev`}
      style={{ ...style}}
      onClick={onClick}
    >
        <i className="ion-ios-arrow-left"></i>
    </button>
  );
}

function SlickArrow() {
  return (
    <div>SlickArrow</div>
  )
}

export default SlickArrow
