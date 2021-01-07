import React from 'react';
import update from 'immutability-helper';
import { ResourceList, ResourceItem, TextStyle, Thumbnail, Button, Stack } from '@shopify/polaris';
import { HideMinor, ConfettiMajor, MobileCancelMajor, ExternalMinor } from '@shopify/polaris-icons';
import Confetti from 'react-dom-confetti';

const config = {
    angle: "165",
    spread: "60",
    startVelocity: 30,
    elementCount: "50",
    dragFriction: "0.13",
    duration: "3000",
    stagger: "3",
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
};

const MovieList = (props) => {
    const addNomination = (movieItem) => {
        props.updateNominationsHandler(update(props.currentNominations, { $push: [movieItem] }));
    }

    const removeNomination = (movieItem) => {
        const movieItemIndex = props.currentNominations.indexOf(movieItem);
        if (movieItemIndex >= 0) {
            props.updateNominationsHandler(update(props.currentNominations, { $splice: [[movieItemIndex, 1]] }));
        }
    }

    const resourceItemButtons = (item) => {
        const { imdbID } = item;
        const alreadyNominated = props.currentNominations.some(movie => movie.imdbID === imdbID);
        const buttonDisabled = alreadyNominated || props.currentNominations.length >= 5;
        const tooltipText = alreadyNominated ? 'Already nominated' : 'Nomination limit reached';

        if (props.nominationVariant) {
            return <Button type="button" icon={MobileCancelMajor} size='medium' onClick={() => removeNomination(item)} />
        }
        else {
            return (
                <>
                    <Confetti active={alreadyNominated} config={config} />
                    <Button type="button" url={`https://www.imdb.com/title/${imdbID}`} icon={ExternalMinor} size='medium' external />
                    <span title={buttonDisabled ? tooltipText : null}>
                        <Button
                            type="button"
                            icon={ConfettiMajor}
                            size='medium'
                            onClick={() => addNomination(item)}
                            disabled={buttonDisabled}
                        />
                    </span>
                </>
            )
        }
    }

    return (
        <ResourceList
            resourceName={{ singular: 'movie', plural: 'movies' }}
            items={props.movies}
            loading={props.loadingRequest}
            showHeader={!props.nominationVariant && !props.shareVariant}
            renderItem={(item) => {
                const { Title, Year, imdbID, Poster } = item;
                const media = (Poster !== 'N/A' ?
                    <Thumbnail source={Poster} alt={`Movie poster`} /> :
                    <Thumbnail source={HideMinor} alt={`Movie poster missing`} />);

                return (
                    <ResourceItem
                        id={imdbID}
                        accessibilityLabel={`View details for ${Title}`}
                        media={media}
                    >
                        <Stack>
                            <Stack.Item vertical spacing='extraTight' fill>
                                <h3>
                                    <TextStyle variation="strong">{Title}</TextStyle>
                                </h3>
                                <p>{Year}</p>
                            </Stack.Item>
                            <Stack.Item>
                                {resourceItemButtons(item)}
                            </Stack.Item>
                        </Stack>
                    </ResourceItem>
                )
            }}
        />
    )
}

export default MovieList;