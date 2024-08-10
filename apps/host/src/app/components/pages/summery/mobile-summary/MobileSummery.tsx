import { Container, Box, Button, Typography } from "@mui/material";
import CategoryCard from "./CategoryCard";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useState } from 'react';
import OfficeRequests from "./OfficeRequests";
import { Category } from "./CategoryCard";

const allCategories: Category []= [ {
    category:"Occupancy rate",
    value : "70%"
},
{
    category:"Total booking value",
    value : "$1,200"
},
{
    category:"Conversion rate",
    value : "53%"
},
{
    category:"Listing clicks",
    value : "3,023"
},
{
    category:"Portfolio growth rate",
    value : "46"
},
{
    category:"Guest satisfaction",
    value : "70%"
},
{
    category:"Re-book rates",
    value : "36%"
},
{
    category:"Listing saves",
    value : "1,022"
},
{
    category:"Avg booking duration",
    value : "3"
},
{
    category:"Total inqueries",
    value : "3"
}  
]




const MobileSummery = () => {
    const [showLimited, setShowLimited] = useState(true);
    const categoriesToShow = showLimited ? allCategories.slice(0, 4) : allCategories;


    const calculateDayPeriod = ()=>
        {
            const currentHour= new Date().getHours();
            if (currentHour >= 5 && currentHour <= 12) {
                return "Good Morning";
              } else if (currentHour > 12 && currentHour < 17) {
                return "Good Afternoon";
              } else if (currentHour >= 17 && currentHour <= 21) {
                return "Good Evening";
              } else {
                return "Good Night";
              }
        }





 return (
        <Container disableGutters>
            <Typography fontWeight={400} fontSize={22} paddingTop={6} paddingBottom={2}>
               { calculateDayPeriod()}
            </Typography>
            <Box marginBottom={1}
            sx= {{
                display:"grid",
                gridTemplateColumns:"1fr 1fr",
                justifyContent: "space-between",
                gap: 2,
            }}
            >
            {categoriesToShow.map((categoryItem, index) => (
                <CategoryCard
                    key={index}
                    category={categoryItem.category}
                    value={categoryItem.value}
                />
            ))}
                  <Button sx={{fontWeight:600, fontSize:14,
                  pl:0,
                  marginRight:'auto', textTransform:'none',
                    color:"primary.contrastText",
                    "& .MuiButton-endIcon": {
                        margin:0,
                        "&>*:nth-child(1)": {
                            fontSize:32
                          }

                    }
                  }}
                    onClick={() => setShowLimited(!showLimited)}
                    endIcon = {<KeyboardArrowRightIcon/>}

                    >
        {showLimited ? 'See more' : 'Show Limited'}
      </Button>
        </Box>
        <OfficeRequests></OfficeRequests>
        </Container>
    );
}

export default MobileSummery;