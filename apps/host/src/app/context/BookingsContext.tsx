import { Booking } from '@offisito-shared';
import { ServerContext, axiosErrorToaster, useSubscribe } from '@base-frontend';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { MainMessage } from '@offisito-frontend';

interface BookingsContextProps {
  children: ReactNode;
}

export const BookingsContext = createContext<{
  bookings: Booking[];
}>({
  bookings: [],
});

export const BookingsContextProvider = ({ children }: BookingsContextProps) => {
  const [loading, setLoading] = useState(true);

  const server = useContext(ServerContext);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const { res } = useSubscribe('server.offisito.com', 'api/bookings/subscribe');

  const fetchBookings = useCallback(async () => {
    try {
      const res = await server?.axiosInstance.get('/api/bookings/');
      res && setBookings(res.data);
      setLoading(false);
    } catch (e) {
      axiosErrorToaster(e);
    }
  }, [server?.axiosInstance]);

  useEffect(() => {
    fetchBookings().then();
  }, [fetchBookings, res]);

  return (
    <BookingsContext.Provider
      value={{
        bookings,
      }}
    >
      {loading ? <MainMessage text="Loading you listings..." /> : children}
    </BookingsContext.Provider>
  );
};
