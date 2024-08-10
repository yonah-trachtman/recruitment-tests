import { useListingFormPage } from './useListingFormPage';
import { BookingRequestForm2 } from './BookingRequestForm2';
import { useNavigate } from 'react-router-dom';
import { Img } from '@base-frontend';

export const ListingFormPage = () => {
  const { isLoading, isError, listing } = useListingFormPage();

  const navigate = useNavigate();

  if (isLoading)
    return <div style={{ color: 'gray', textAlign: 'center' }}>...Loading</div>;
  if (isError || !listing)
    return <div style={{ color: 'gray', textAlign: 'center' }}>...Error</div>;

  // TODO: maybe (?) improve BookingRequestForm2 structure for better readability

  return (
    <section className="listing-form-page">
      <p style={{ color: 'gray', textAlign: 'center' }}>
        Hi From Listing Form Page
      </p>

      <section style={{ display: 'flex' }}>
        {listing?.photoURLs ? (
          <Img
            src={listing.photoURLs[0]}
            alt="office"
            style={{ objectFit: 'cover', width: '100%' }}
          ></Img>
        ) : (
          <p style={{ color: 'gray', textAlign: 'center', width: '100%' }}>
            No asset image found
          </p>
        )}
      </section>

      <BookingRequestForm2
        close={() => {
          navigate(`/?space=${String(listing._id)}`);
        }}
        asset={listing}
      />
      {/* <BookingRequestForm close={()=>{console.log("close")}} asset={listing} /> */}
    </section>
  );
};
