import { useState, useEffect } from "react";
import "../../styles/Home.css";
import { Link } from "react-router-dom";
import { ReactComponent as XWORD_FULL } from "../../assets/icons/xword-full-logo.svg";

export default function Home({ games }) {
  const gamesData = games.map(puzzle => {
    const { _id, name, description } = puzzle;
    return (
      <Link key={_id} to={`/puzzles/${_id}`} state={puzzle}>
        <div className="puzzle-list-item">
          <h3>{name}</h3>
          <p>{description}</p>
        </div>
      </Link>
    );
  });

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
