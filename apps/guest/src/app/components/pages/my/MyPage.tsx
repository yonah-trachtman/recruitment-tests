import { GenericTable } from '@base-frontend';

const MyPage = () => {
  return (
    <GenericTable
      endpoint="api/bookings"
      customColumns={[{ path: ['requestStatus'], name: 'Status' }]}
      actions={[]}
    />
  );
};

export default MyPage;
