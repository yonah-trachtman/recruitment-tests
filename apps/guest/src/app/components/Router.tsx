import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { NotificationsPage } from '@base-frontend';
import FindPage from './pages/search/FindPage';
import MyPage from './pages/my/MyPage';
import { ListingFormPage } from './pages/listing-details/ListingFormPage';
import { CustomLayout } from './pages/CustomLayout';
import { UserType } from '@offisito-shared';
import { Btn, CloseButton, PrimaryText, SettingPage } from '@offisito-frontend';

const ChatsPage = lazy(() =>
  import('@base-frontend').then((module) => ({
    default: module.ChatsPage,
  })),
);

export const router = createBrowserRouter([
  {
    element: <CustomLayout />,
    children: [
      {
        path: '/*',
        element: <FindPage />,
      },
      {
        path: '/my',
        element: <MyPage />,
      },
      {
        path: '/chats',
        element: (
          <Suspense fallback={<div>...</div>}>
            <ChatsPage
              domain="server.offisito.com"
              tenum={UserType}
              customComponents={{ Btn, CloseButton, PrimaryText }}
            />
            ,
          </Suspense>
        ),
      },
      {
        path: '/settings',
        element: <SettingPage />,
      },
      {
        path: '/notification',
        element: <NotificationsPage />,
      },
      {
        path: '/listingform/:id',
        element: <ListingFormPage />,
      },
    ],
  },
]);
