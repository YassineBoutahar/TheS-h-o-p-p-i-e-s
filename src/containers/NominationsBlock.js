import React from 'react';
import { Card, Heading, EmptyState, Icon } from '@shopify/polaris';
import { CircleTickMajor } from '@shopify/polaris-icons';
import MovieList from '../components/MovieList';
import WinnerLogo from '../WinnerIconLight.svg';

const NominationsBlock = (props) => {

  return (
    <Card sectioned>
      {props.currentNominations.length > 0 ? (
        <>
          <Card.Header title='Nominations'>
            <Heading>
              {props.currentNominations.length === 5 ?
                <Icon source={CircleTickMajor} color='greenDark' backdrop /> :
                `${props.currentNominations.length} / 5`}
            </Heading>
          </Card.Header>
          <br />
          <MovieList
            nominationVariant
            movies={props.currentNominations}
            currentNominations={props.currentNominations}
            updateNominationsHandler={props.updateNominationsHandler}
          />
        </>) : (
          <EmptyState heading='Nominate a movie' image={WinnerLogo}>
            <p>You can nominate up to 5 movies for this year's Shoppies.</p>
          </EmptyState>)}
    </Card>
  )
}

export default NominationsBlock;