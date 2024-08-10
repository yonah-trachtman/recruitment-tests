import { Grid } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { axiosErrorToaster, findMe, ServerContext } from '@base-frontend';
import { Asset } from '@offisito-shared';
import { AssetCard, Btn, PrimaryText } from '@offisito-frontend';

const NearSpaces = () => {
  const [assetsNear, setassetsNear] = useState<Asset[]>([]);

  const server = useContext(ServerContext);

  const fetchNearAssets = () =>
    findMe().then(
      (location) =>
        server &&
        (location
          ? server.axiosInstance.get(
              `/api/assets/near?lat=${location.lat}&lng=${location.lng}`,
            )
          : server.axiosInstance.get(`/api/assets/nearandom`)
        )
          .then((response) => setassetsNear(response.data))
          .catch((error) => axiosErrorToaster(error)),
    );
  useEffect(() => {
    fetchNearAssets().then();
  }, []);

  return (
    <Grid container direction="column">
      <Grid item container alignItems="center" columnSpacing={4}>
        <Grid item>
          <PrimaryText>Spaces near you</PrimaryText>
        </Grid>
        <Grid item>
          <Btn sx={{ fontSize: '75%' }}>See all</Btn>
        </Grid>
      </Grid>
      <Grid
        overflow="scroll"
        item
        container
        alignItems="center"
        columnSpacing={6}
        width="100%"
        wrap="nowrap"
      >
        {assetsNear.map((asset) => (
          <Grid key={asset._id.toString()} item width="100%">
            <AssetCard asset={asset} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default NearSpaces;
