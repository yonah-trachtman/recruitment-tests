import { Grid } from '@mui/material';
import { useContext, useState } from 'react';
import { BookingsContext } from '../../../context/BookingsContext';
import { ObjectId } from 'mongoose';
import { HostBookingCard, ListingsContext } from '@offisito-frontend';
import { Asset, Booking } from '@offisito-shared';
import { TODO } from '@base-shared';

// TODO: make a calendar component
// TODO: find a way to recieve dates for HostBookingCard

const New = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const { myAssets } = useContext(ListingsContext);
  const { bookings } = useContext(BookingsContext);

  const getAssetById = (myAssets: Asset[], _id: ObjectId) => {
    return myAssets.find((asset) => String(asset._id) === String(_id));
  };

  const handleOnClick = (ev: any, cardIndex: number, assetId: ObjectId) => {
    ev.stopPropagation();
    console.log(
      `clicked - cardIndex: ${cardIndex}, assetId: ${String(assetId)}`,
      ev,
    );
    if (activeCard === cardIndex) setActiveCard(null);
    else setActiveCard(cardIndex);
  };

  const queryBookingsByAssetId = (assetId: ObjectId) => {
    const filteredBookings = bookings.filter(
      (booking: Booking) => String(booking.asset) === String(assetId),
    );
    return filteredBookings;
  };

  if (!myAssets) return <></>;
  return (
    <Grid padding="20px 25px 0 25px">
      {bookings.map((booking: TODO, index: number) =>
        getAssetById(myAssets, booking.asset) ? (
          <HostBookingCard
            key={String(booking._id)}
            booking={booking}
            relatedBookings={queryBookingsByAssetId(booking.asset)}
            asset={getAssetById(myAssets, booking.asset) as Asset}
            handleOnClick={handleOnClick}
            cardIndex={index}
            isSelected={activeCard === index}
          ></HostBookingCard>
        ) : null,
      )}
    </Grid>
  );
};

export default New;
