import React, { useCallback, useState } from 'react';
import '@shopify/polaris/dist/styles.css';
import { AppProvider, Layout, DisplayText, Banner, Frame, Toast } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import SearchBlock from './SearchBlock';
import ResultsBlock from './ResultsBlock';
import NominationsBlock from './NominationsBlock';
import axios from 'axios';
const apiKey = 'cc1c6651'
const nominationKey = 'ShoppiesNominations';

const Home = () => {
  const [searchVal, setSearchVal] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMovies, setCurrentMovies] = useState(null);
  const [currentNominations, setCurrentNominations] = useState(() => window.localStorage.getItem(nominationKey) ? JSON.parse(window.localStorage.getItem(nominationKey)) : []);
  const [totalResults, setTotalResults] = useState(0);
  const [currentOMDBError, setCurrentOMDBError] = useState('Search for a movie');
  const [OMDBRequestLoading, setOMDBRequestLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(currentNominations && currentNominations.length === 5);
  const [showToast, setShowToast] = useState(false);

  const handleSearchValChange = (val) => {
    setSearchVal(val);
    getMovies(val);
  };

  const copyToClipboard = () => {
    let shareUrl = `${window.location.href}share/?nominations=${currentNominations.map(nom => nom.imdbID).join(',')}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => setShowToast(true));
  }

  const handleClearButtonClick = useCallback(() => {
    setSearchVal('');
    clearSearchResults();
  }, []);

  const clearSearchResults = () => {
    setCurrentMovies(null);
    setTotalResults(0);
    setCurrentOMDBError('Search for a movie');
  }

  const handlePageChange = (pageDifference) => {
    setCurrentPage(prevState => prevState + pageDifference);
    getMovies(searchVal, currentPage + pageDifference);
  }

  const updateNominations = useCallback((movieList) => {
    setCurrentNominations(movieList);
    window.localStorage.setItem(nominationKey, JSON.stringify(movieList));

    if (movieList.length === 5) {
      setShowBanner(true);
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }
    else { setShowBanner(false) }
  }, []);

  const getMovies = (searchValue, currPage) => {
    if (!searchValue) {
      clearSearchResults();
      return;
    }

    setOMDBRequestLoading(true);

    axios.get(`https://www.omdbapi.com/?apikey=${apiKey}&type=movie&s=${searchValue}&page=${currPage}`)
      .then((response) => {
        if (response.data.Response === 'True') {
          setCurrentMovies(response.data.Search);
          setTotalResults(parseInt(response.data.totalResults));
        }
        else {
          clearSearchResults();
          setCurrentOMDBError(response.data.Error);
        }
      })
      .catch((error) => alert(error))
      .then(() => { setOMDBRequestLoading(false); });
  }


  return (
    <AppProvider i18n={enTranslations}>
      <div style={{ paddingLeft: '36px', paddingRight: '36px', paddingTop: '12px' }}>
        <Frame>
          <Layout>
            <Layout.Section fullWidth>
              {showBanner &&
                <Banner
                  status='success'
                  title="Shoppies nominations complete!"
                  onDismiss={() => setShowBanner(false)}
                  action={{ content: 'Share nominations', onAction: () => copyToClipboard() }}
                />}

              {showToast && <Toast content="Copied to clipboard" onDismiss={() => setShowToast(false)} />}
              <DisplayText element="h1" size='extraLarge'>The Shoppies</DisplayText>
            </Layout.Section>

            <Layout.Section fullWidth>
              <SearchBlock
                searchHandler={handleSearchValChange}
                clearHandler={handleClearButtonClick}
                currentSearch={searchVal}
              />
            </Layout.Section>

            <Layout.Section oneHalf>
              <ResultsBlock
                currentSearch={searchVal}
                searchResults={currentMovies}
                errorMessage={currentOMDBError}
                currentPage={currentPage}
                totalResults={totalResults}
                handlePageChange={handlePageChange}
                loadingRequest={OMDBRequestLoading}
                currentNominations={currentNominations}
                updateNominationsHandler={updateNominations}
              />
            </Layout.Section>

            <Layout.Section oneHalf>
              <NominationsBlock
                currentNominations={currentNominations}
                updateNominationsHandler={updateNominations}
              />
            </Layout.Section>
          </Layout>
        </Frame>
      </div>
    </AppProvider>
  );
}

export default Home;
