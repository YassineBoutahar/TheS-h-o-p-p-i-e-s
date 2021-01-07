import React from 'react';
import { Card, Pagination, EmptySearchResult } from '@shopify/polaris';
import MovieList from '../components/MovieList';

const ResultsBlock = (props) => {

    return (
        <Card sectioned>
            {props.currentSearch &&
                <Card.Header title={`Results for "${props.currentSearch}"`}>
                    {props.searchResults &&
                        <Pagination
                            label={`${props.currentPage} of ${Math.ceil(props.totalResults / 10)}`}
                            hasPrevious={props.currentPage > 1}
                            onPrevious={() => { props.handlePageChange(-1); }}
                            onNext={() => { props.handlePageChange(1); }}
                            hasNext={props.currentPage <= Math.floor(props.totalResults / 10) && props.currentPage <= 100}
                        />}
                </Card.Header>}
            {props.searchResults ? (
                <MovieList
                    movies={props.searchResults}
                    loadingRequest={props.loadingRequest}
                    currentPage={props.currentPage}
                    totalResults={props.totalResults}
                    handlePageChange={props.handlePageChange}
                    currentNominations={props.currentNominations}
                    updateNominationsHandler={props.updateNominationsHandler}
                />)
                : (<EmptySearchResult title={props.errorMessage} withIllustration />)}
        </Card>
    )
}

export default ResultsBlock;