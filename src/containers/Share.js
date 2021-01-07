import React, { useEffect, useState, useRef } from 'react';
import '@shopify/polaris/dist/styles.css';
import { AppProvider, Layout } from '@shopify/polaris';
import { useLocation } from "react-router-dom";
import Coverflow from 'react-coverflow';
import axios from 'axios';
import ShopifyTrophy from '../ShopifyTrophy.png';
import PosterNotAvailable from '../PosterNotAvailable.jpg';
const apiKey = 'cc1c6651'

const useQuery = () => new URLSearchParams(useLocation().search);

const Share = () => {
    let query = useQuery();
    const friendName = query.get("name") ? query.get("name") : 'Your friend'
    const nominations = query.get("nominations") ? query.get("nominations").split(',') : [];

    const [currentMovies, setCurrentMovies] = useState([]);
    const [missingMovies, setMissingMovies] = useState(0);

    const movieRef = useRef(null);

    useEffect(() => {
        let promiseArray = [];
        let pulledMovies = [];
        let erroredMovies = 0;
        for (const movieId of nominations) {
            promiseArray.push(axios.get(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`));
        }
        Promise.all(promiseArray)
            .then((responses) => {
                for (const response of responses) {
                    if (response.data.Response === 'True') {
                        pulledMovies.push(response.data);
                    }
                    else {
                        erroredMovies += 1;
                    }
                }
                setCurrentMovies(pulledMovies);
                setMissingMovies(erroredMovies);
                if (pulledMovies.length > 0) {
                    movieRef.current.click();
                }
            })
            .catch(function (error) {
                setMissingMovies(5);
                alert(error);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let posters = (
        currentMovies.map((movie, index) => (
            <img
                ref={index === 0 ? movieRef : null}
                key={index + 1}
                src={movie.Poster !== 'N/A' ? movie.Poster : PosterNotAvailable}
                alt={movie.Title}
                data-action={`https://www.imdb.com/title/${movie.imdbID}`}
                style={{ display: 'block', width: '100%' }}
                onError={(e) => {e.target.src = PosterNotAvailable}}
            />

        ))
    )

    return (
        <AppProvider>
            <Layout>
                <Layout.Section>
                    <Coverflow
                        width={window.innerWidth}
                        height={window.innerHeight}
                        displayQuantityOfSide={2}
                        navigation={false}
                        enableHeading
                        enableScroll
                        infiniteScroll
                    >
                        <div
                            role="menuitem"
                            tabIndex="0"
                            key={0}
                            alt={`${friendName}'s 2020 Shoppies nominees`}
                        >
                            {missingMovies > 0 &&
                                <p style={{ position: 'absolute', zIndex: 1000, textAlign: 'center', width: '100%' }}>
                                    {`Note: ${missingMovies} ${missingMovies === 1 ? 'movie' : 'movies'} could not be loaded.`}
                                </p>}
                            <img src={ShopifyTrophy} style={{ display: 'block', width: '100%' }} alt="Trophy" />
                        </div>
                        {posters}
                    </Coverflow>
                </Layout.Section>
            </Layout>
        </AppProvider>
    );
}

export default Share;
