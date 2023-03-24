import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";

const Modal = () => {
  /**
   * State
   */
  const [openMenu, setOpenMenu] = useState(false);
  const [seasons, setSeasons] = useState([]);
  const [races, setRaces] = useState([]);
  const [winner, setWinner] = useState([]);

  /**
   * Get api Data
   */
  const getSeason = async () => {
    try {
      const res = await axios.get(
        "http://ergast.com/api/f1/seasons.json?limit=100"
      );
      setSeasons(res.data.MRData.SeasonTable.Seasons);
    } catch (error) {
      console.log(error);
    }
  };

  const getRaceData = async (event) => {
    const textValue = event.target.textContent;
    const convertedTextValue = parseInt(textValue, 10);
    const getChamp = event.target.textContent;
    const convertGetChamp = parseInt(getChamp, 10);

    try {
      const response = await axios.get(
        `http://ergast.com/api/f1/${convertedTextValue}/results.json?limit=100`
      );
      setRaces(response.data.MRData.RaceTable.Races);

      const responseTwo = await axios.get(
        `http://ergast.com/api/f1/${convertGetChamp}/driverStandings.json?limit=100`
      );
      setWinner(responseTwo.data.MRData.StandingsTable.StandingsLists);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * useEffect hook used to update the data after the rerender of the component
   * Return empty dependency Array to only make the api call once otherwise you create a infinite loop
   */
  useEffect(() => {
    getSeason();
    getRaceData();
  }, []);

  /**
   * Event Listeners to open and close the modal
   */
  const openModal = () => {
    setOpenMenu(!openMenu);
  };

  const closeModal = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <>
      <div className="overlay bg-neutral-800 opacity-50"></div>
      <div className="heading-text absolute left-0 right-0 top-0">
        <button className="open-modal" onClick={openModal}>
          View Stats
        </button>
        <p className="text-red-100 text-center">
          F1 stats from 2005 untill present
        </p>
      </div>

      {openMenu && (
        <div className="modal ">
          <div className="overlay" onClick={openModal}></div>

          <div className="modal-content overflow-y-auto">
            <div className="side-content">
              {seasons.map((season) => {
                // Convert season(string) to a number
                const convertedSeasonNumber = parseInt(season.season, 10);

                if (convertedSeasonNumber >= 2005) {
                  return (
                    <>
                      <button
                        onClick={getRaceData}
                        className="
                        bg-gradient-to-r from-orange-400 to-orange-800
                        text-white
                        hover:text-white
                        rounded-md 
                        cursor-pointer
                        text-center
                        p-1
                        text-sm
                        "
                      >
                        {convertedSeasonNumber}
                      </button>
                    </>
                  );
                }
              })}
            </div>

            <div className="race-content-container mb-3">
              <div className="race-content bg-neutral-700 p-3 rounded-lg">
                {winner.map((driver) => {
                  const winnerName = driver.DriverStandings[0].Driver.driverId;

                  return (
                    <div className="space-y-2">
                      <h2 className="text-orange-300 font-semibold text-lg text-center">
                        World Champion: {winnerName.toUpperCase()}
                      </h2>
                      {races.map((r) => {
                        const seasonWinner = r.Results[0].Driver.driverId;

                        if (winnerName === seasonWinner) {
                          return (
                            <li className="bg-red-600 text-neutral-100 p-1 rounded-lg text-[18px]">
                              Race Winner: {seasonWinner.toUpperCase()}
                            </li>
                          );
                        }

                        return (
                          <>
                            <li className="text-[18px] text-left">
                              Race Winner: {seasonWinner.toUpperCase()}
                            </li>
                          </>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            <button className="close-modal" onClick={closeModal}>
              <span class="material-symbols-outlined text-sm text-white hover:rotate-45 hover:transition-all">
                close
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
