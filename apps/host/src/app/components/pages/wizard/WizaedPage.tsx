import { Grid, LinearProgress } from '@mui/material';
import { useState } from 'react';
import { Btn, PrimaryText } from '@offisito-frontend';

const steps = [1, 1, 1, 1, 1, 11, 1, 11, 1];

const WizaedPage = () => {
  const [step, setStep] = useState(1);

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      height="100%"
      width="100%"
      wrap="nowrap"
      padding="20px 25px 0 25px"
    >
      <Grid
        item
        height="90%"
        container
        direction="column"
        alignItems="center"
        width="100%"
        rowSpacing={2}
        wrap="nowrap"
      >
        <PrimaryText>
          {step}/{steps.length + 1}
        </PrimaryText>
      </Grid>
      <Grid
        item
        container
        direction="column"
        alignItems="center"
        width="100%"
        rowSpacing={2}
        wrap="nowrap"
      >
        <Grid item width="100%">
          <LinearProgress
            sx={{ width: '100%' }}
            variant="determinate"
            value={(step * 100) / (steps.length + 1)}
          />
        </Grid>
        <Grid item container justifyContent="flex-end" alignItems="center">
          <Grid item height="100%">
            <Btn
              sx={{ marginRight: '20px' }}
              onClick={
                step / (steps.length + 1) === 1
                  ? () => {}
                  : () => setStep((p) => p + 1)
              }
            >
              {step / (steps.length + 1) === 1 ? 'Finish' : 'Next'}
            </Btn>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default WizaedPage;
