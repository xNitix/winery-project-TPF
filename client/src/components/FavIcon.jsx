import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "./styles/FavIcon.css";
import { FavContext } from "../context/FavContext";
import { useContext, useEffect, useState } from "react";

const FavIcon = ({ id }) => {
  const { favIds, removeFav, addFav } = useContext(FavContext);
  const [isFav, setIsFav] = useState(favIds.includes(id));

  useEffect(() => {
    setIsFav(favIds.includes(id));
  });

  function changeState() {
    setIsFav((prev) => !prev);
    if (isFav) {
      removeFav(id);
    } else {
      addFav(id);
    }
  }

  return (
    <div onClick={changeState}>
      <FontAwesomeIcon
        icon={faHeart}
        className={isFav ? "fav-icon fav" : "fav-icon"}
      />
    </div>
  );
};

export default FavIcon;
