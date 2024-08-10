import { Category } from "@mui/icons-material";
import { Card, CardActions, CardContent, IconButton, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { FC } from 'react'

export interface Category {
    category: string;
    value: string;
}

const CategoryCard: FC<Category> = ({ category, value }) => {
    return (
        <Card sx={{width:1,borderRadius: 6}} >
            <CardContent sx={{pr:0, paddingBottom: 0, "&:last-child": { paddingBottom: 0 } }}   >
                <Typography variant="h6" color='primary.contrastText' noWrap  sx={{mb:0,fontWeight:500}} >
                {category}
                </Typography>
                <Typography color='primary' variant="h2" sx={{mb:0,lineHeight:1.3,fontWeight:600}}>
                {value}
                </Typography>
                <CardActions  disableSpacing  sx={{p:0, mt:-2}} >
                    <IconButton sx={{marginLeft:'auto'}} aria-label="display graph">
                        <KeyboardArrowRightIcon  sx={{color:"text.secondary"}}/>

                    </IconButton>

                </CardActions>

            </CardContent>
        </Card>
    );
}

export default CategoryCard;