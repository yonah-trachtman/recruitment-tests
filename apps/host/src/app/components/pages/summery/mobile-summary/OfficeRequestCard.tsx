import {
  Box,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
} from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { FC } from 'react';
import { styled } from '@mui/material/styles';
import { LocationSVG } from '@offisito-frontend';

const CircleDiv = styled('div')(({ theme }) => ({
  paddingLeft: 5,
  paddingRight: 5,
  paddingTop: 3,
  paddingBottom: 3,
  backgroundColor: theme.palette.error.main,
  borderRadius: '50%',
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
}));

export interface OfficeRequest {
  address: string;
  roomNumber: string;
  floor: string;
  totalRequests: number;
}

const OfficeRequestCard: FC<OfficeRequest> = ({
  address,
  roomNumber,
  floor,
  totalRequests,
}) => {
  return (
    <Card
      sx={{
        boxShadow: 0,
        borderBottom: 2,
        borderColor: '#CAC4D0',
        pb: 2,
        width: 1,
        borderRadius: 0,
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          pt: 0,
          gap: 1,
          pr: 0,
          '&:last-child': { paddingBottom: 0 },
        }}
      >
        <LocationSVG outerColor="#2B3F6C" innerColor="#2B3F6C" />

        <Typography
          color="primary.contrastText"
          sx={{ fontWeight: 600, fontSize: 11, lineHeight: 2 }}
        >
          {address}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ fontWeight: 500, fontSize: 11, lineHeight: 2 }}
        >
          {roomNumber}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ fontWeight: 500, fontSize: 11, lineHeight: 2 }}
        >
          ({floor}F)
        </Typography>

        <CardActions sx={{ p: 0, marginLeft: 'auto' }}>
          <CircleDiv>
            <Typography
              color="error.contrastText"
              sx={{
                fontSize: 11,
                fontWeight: 500,
                wordWrap: 'break-word',
              }}
            >
              {totalRequests}
            </Typography>
          </CircleDiv>
          <IconButton sx={{ m: 0, p: 0 }} aria-label="display request">
            <KeyboardArrowRightIcon
              sx={{
                m: 0,
                p: 0,
                mt: -0.3,
                color: 'primary.contrastText',
              }}
            />
          </IconButton>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default OfficeRequestCard;
