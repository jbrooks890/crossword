import { useState, useEffect } from "react";
import "../../styles/Home.css";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { ReactComponent as XWORD_FULL } from "../../assets/icons/xword-full-logo.svg";
import apiUrl from "../../config";

export default function Home({ games }) {
  // const [games, setGames] = useState([]);
  const [activeGame, setActiveGame] = useState({});

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(`${apiUrl}/puzzles`);
  //     setGames(response.data.puzzles);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // useEffect(async () => fetchData(), []);

  const gamesData = games.map(puzzle => {
    const { _id, name, description } = puzzle;
    return (
      <Link key={_id} to={`/puzzles/${_id}`}>
        <div className="puzzle-list-item">
          <h3>{name}</h3>
          <p>{description}</p>
        </div>
      </Link>
    );
  });

  // games.length && console.log(games);

  return (
    <div id="home-page">
      <h1 className="home-page-logo">
        <XWORD_FULL />
      </h1>
      <h2>Play</h2>
      <div id="game-list">{games.length > 0 && gamesData}</div>
    </div>
  );
}
