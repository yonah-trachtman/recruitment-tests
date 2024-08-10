import { CircularProgress, Grid } from '@mui/material';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { IconColorer, ServerContext } from '@base-frontend';
import { Amenity, Asset, Query } from '@offisito-shared';
import { useLocation } from 'react-router-dom';
import { LocationOn, Tune } from '@mui/icons-material';
import {
  AssetCard,
  Btn,
  ListingPage,
  ListingsContext,
  PrimaryText,
  ResultsMap,
  SearchContext,
} from '@offisito-frontend';

const FindPage = () => {
  const { setSearch, results, setResults, setQuery, fetch } =
    useContext(SearchContext);
  const [selectedListing, setSelectedListing] = useState<Asset>();
  const [mapMode, setMapMode] = useState(false);

  const { amenities } = useContext(ListingsContext);

  const server = useContext(ServerContext);

  const useQuery = () => {
    const location = useLocation();
    return useMemo(
      () => new URLSearchParams(location.search),
      [location.search],
    );
  };

  const query = useQuery();

  const fetchAsset = useCallback(
    async (id: string) => {
      const res = await server?.axiosInstance.get('api/search/single/' + id);
      res && setSelectedListing(res.data);
    },
    [server?.axiosInstance],
  );

  useEffect(() => {
    const id = query.get('space');
    if (id) {
      fetchAsset(id);
    } else {
      setSelectedListing(undefined);
      !results && fetch();
    }
  }, [query, fetchAsset, setResults, results, fetch]);

  const handleAmenityToggle = (amenity: Amenity) =>
    setQuery((prev: Query) => ({
      ...prev,
      params: {
        ...prev.params,
        requiredAmenities: prev.params.requiredAmenities?.some(
          (existing) => String(existing._id) === String(amenity._id),
        )
          ? prev.params.requiredAmenities?.filter(
              (existing) => String(existing._id) !== String(amenity._id),
            )
          : [...(prev.params.requiredAmenities || []), amenity],
      },
    }));

  const resultsJSX =
    results?.length && results?.length > 0 ? (
      <>
        <Grid item width="100%" padding="5% 5% 0">
          <Grid
            item
            container
            width="100%"
            height="50px"
            alignItems="center"
            wrap="nowrap"
            borderRadius="35px"
            boxShadow="1px 2px #bababa"
            onClick={() => {
              setSearch(true);
              setResults(undefined);
            }}
          >
            <Grid item width="10%" paddingLeft="5%">
              <IconColorer>
                <LocationOn />
              </IconColorer>
            </Grid>
            <Grid item width="80%" paddingLeft="5%">
              <PrimaryText>Search office places</PrimaryText>
            </Grid>
            <Grid item width="10%">
              <IconColorer>
                <Tune />
              </IconColorer>
            </Grid>
          </Grid>
        </Grid>
        {mapMode ? (
          <Grid item width="100%" height="calc(100% - 100px)">
            <ResultsMap setMap={setMapMode} assets={results} />
          </Grid>
        ) : (
          <>
            <Grid
              item
              container
              justifyContent="space-evenly"
              alignItems="center"
              paddingBottom={1}
            >
              {amenities.map((amenity: Amenity) => (
                <Grid item key={String(amenity._id)}>
                  <Btn onClick={() => handleAmenityToggle(amenity)}>
                    {amenity.name}
                  </Btn>
                </Grid>
              ))}
            </Grid>
            <Grid
              item
              container
              direction="column"
              width="100%"
              marginTop="1%"
              rowSpacing={4}
              overflow="scroll"
              wrap="nowrap"
            >
              {results.map((asset: Asset) => (
                <Grid item width="100%" key={String(asset._id)}>
                  <AssetCard asset={asset} />
                </Grid>
              ))}
            </Grid>
            <Grid item position="absolute" bottom={80}>
              <Btn onClick={() => setMapMode(true)}>Map View</Btn>
            </Grid>
          </>
        )}
      </>
    ) : (
      <>
        <Grid item width="100%" padding="5% 5% 0">
          <PrimaryText>No Spaces found for selected filters</PrimaryText>
        </Grid>
        <Grid item width="100%" padding="5% 5% 0">
          <Btn
            onClick={() => {
              setQuery({
                config: {},
                params: {},
              });
              setResults(undefined);
              setSearch(true);
            }}
          >
            Re-Search
          </Btn>
        </Grid>
      </>
    );

  return selectedListing ? (
    <ListingPage space={selectedListing} />
  ) : (
    <Grid
      container
      direction="column"
      width="100%"
      height="calc(100vh - 100px)"
      alignItems="center"
      rowSpacing={4}
      paddingTop="20px"
      wrap="nowrap"
      overflow="hidden"
    >
      {results ? (
        resultsJSX
      ) : (
        <Grid
          height="calc(96vh - 60px)"
          item
          container
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default FindPage;
