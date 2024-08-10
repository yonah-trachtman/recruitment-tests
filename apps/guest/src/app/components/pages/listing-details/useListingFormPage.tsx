import { Asset } from '@offisito-shared';
import { ServerContext } from '@base-frontend';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

export const useListingFormPage = () => {
  const assetId = useParams()?.id;
  const server = useContext(ServerContext);
  const [listing, setListing] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const isAPICalledRef = useRef(false);

  const fetchAsset = useCallback(
    async (assetId: string) => {
      try {
        isAPICalledRef.current = true;
        setIsLoading(true);
        setIsError(false);

        const res = await server?.axiosInstance.get(
          `api/search/single/${assetId}`,
        );
        if (!res) throw new Error('failed fetching asset');
        setListing(res.data);
      } catch (error) {
        console.error('failed fetching asset', error);
        setIsError(true);
      }
      setIsLoading(false);
    },
    [server?.axiosInstance],
  );

  useEffect(() => {
    if (!isAPICalledRef.current && assetId && !listing && !isLoading) {
      fetchAsset(assetId);
    }
  }, [server?.axiosInstance, assetId, isLoading, listing, isAPICalledRef]);

  return { isLoading, isError, listing };
};
