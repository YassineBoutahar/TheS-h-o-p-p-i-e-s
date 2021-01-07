import React from 'react';
import { Card, Icon, TextField } from '@shopify/polaris';
import { SearchMinor } from '@shopify/polaris-icons';

const SearchBlock = (props) => {

  return (
    <Card title="Find a movie" sectioned>
      <TextField
        value={props.currentSearch}
        placeholder='Tenet'
        prefix={<Icon source={SearchMinor} color="inkLighter" />}
        onChange={props.searchHandler}
        clearButton
        onClearButtonClick={props.clearHandler}
      />
    </Card>
  )
}

export default SearchBlock;