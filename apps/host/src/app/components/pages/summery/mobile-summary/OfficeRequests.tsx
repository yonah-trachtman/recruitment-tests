import { Box, Typography } from '@mui/material';
import { useState, useContext, useEffect } from 'react';
import { BookingsContext } from '../../../../context/BookingsContext';
import OfficeRequestCard, { OfficeRequest } from './OfficeRequestCard';
import { ServerContext, axiosErrorToaster } from '@base-frontend';

const OfficeRequests = () => {
  const server = useContext(ServerContext);
  const { bookings } = useContext(BookingsContext);
  const [officeRequests, setOfficeRequests] = useState<OfficeRequest[]>([]);
  const [allAssets, setAllAssets] = useState<any[]>([]);

  const calculateTotalRequestPerAsset = (): Map<string, number> => {
    const assetToNumberRequestMap: Map<string, number> = new Map();
    bookings.forEach((booking) => {
      if (booking.asset) {
        const assetId = booking.asset.toString();
        const totalRequestForAsset = assetToNumberRequestMap.get(assetId) || 0;
        assetToNumberRequestMap.set(assetId, totalRequestForAsset + 1);
      }
    });
    return assetToNumberRequestMap;
  };

  const generateOfficeRequests = (
    assetToNumberRequestMap: Map<string, number>,
  ): OfficeRequest[] => {
    const tempOfficeRequests: OfficeRequest[] = [];
    assetToNumberRequestMap.forEach((value, key) => {
      const asset = allAssets.find((asset) => asset._id === key);
      if (asset) {
        tempOfficeRequests.push({
          address: asset.address.city,
          roomNumber: asset.roomNumber,
          floor: asset.floorNumber,
          totalRequests: value,
        });
      }
    });
    return tempOfficeRequests;
  };

  useEffect(() => {
    const getUserAssets = async () => {
      const api = 'api/host/assets/assets_list';
      try {
        const res = await server?.axiosInstance.get(api);
        if (res?.data) {
          setAllAssets(res.data); //
        }
        return res?.data;
      } catch (e) {
        axiosErrorToaster(e);
      }
      return undefined;
    };

    getUserAssets();
  }, []);

  useEffect(() => {
    const assetToNumberRequestMap = calculateTotalRequestPerAsset();
    const newOfficeRequests = generateOfficeRequests(assetToNumberRequestMap);
    setOfficeRequests(...[newOfficeRequests]);
  }, [bookings, allAssets]);

  return (
    <Box display="flex" flexDirection={'column'} gap={2}>
      <Typography
        color="primary.contrastText"
        variant="h4"
        sx={{ mb: 0, fontWeight: 400 }}
      >
        New Booking requests
      </Typography>
      {officeRequests.map((officeRequest, index) => (
        <OfficeRequestCard
          key={index}
          address={officeRequest.address}
          roomNumber={officeRequest.roomNumber}
          floor={officeRequest.floor}
          totalRequests={officeRequest.totalRequests}
        />
      ))}
    </Box>
  );
};

export default OfficeRequests;
