import React, { useEffect, useState, useRef } from 'react';
import '@shopify/polaris/dist/styles.css';
import { AppProvider, Layout } from '@shopify/polaris';
import { useLocation } from "react-router-dom";
import Coverflow from 'react-coverflow';
import axios from 'axios';
import ShopifyTrophy from '../ShopifyTrophy.png';
const apiKey = 'cc1c6651'

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Share = () => {
    let query = useQuery();
    const friendName = query.get("name") ? query.get("name") : 'Your friend'

    const [currentMovies, setCurrentMovies] = useState([]);
    const [missingMovies, setMissingMovies] = useState(0);

    const movieRef = useRef(null);

    useEffect(() => {
        const nominations = query.get("nominations") ? query.get("nominations").split(',') : [];
        let promiseArray = [];
        let pulledMovies = [];
        let erroredMovies = 0;
        for (const movieId of nominations) {
            promiseArray.push(axios.get(`http://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`));
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
                movieRef.current.click();
            })
            .catch(function (error) {
                setMissingMovies(5);
                alert(error);
            });
    }, []);

    let posters = (
        currentMovies.map((movie, index) => (
            <img
                ref={index === 0 ? movieRef : null}
                key={index + 1} src={movie.Poster}
                alt={movie.Title}
                data-action={`https://www.imdb.com/title/${movie.imdbID}`}
                style={{ display: 'block', width: '100%' }}
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