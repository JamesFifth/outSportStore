import React from 'react'
import { AppBar, Toolbar, IconButton, Badge, Typography } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import { Link, useLocation } from 'react-router-dom';

import logo from '../../assets/OutSport.png';
import useStyles from './styles';

const Navbar = ({totalItems}) => {
    const classes = useStyles();
    const location = useLocation();

    return (
        <>
            <AppBar position="fixed" className={classes.appBar} color="inherit">

                <Toolbar>

                    {/* the left part */}
                    <Typography component={Link} to="/" variant="h6" className={classes.title} color="inherit">
                        <img src={logo} alt="OutSport Store" height="25px" className={classes.image} />
                        OutSport Store
                    </Typography>

                    {/* as much as space we need here in the middle */}
                    <div className={classes.grow} />

                    {/* if lication is '/' then we show this cart button */}
                    {/* the right part */}
                    { location.pathname === '/' &&
                    (<div className={classes.button}>
                        <IconButton component={Link} to="/cart" aria-label="Show cart items" color="inherit">
                            <Badge badgeContent={totalItems} color="secondary">
                                <ShoppingCart />
                            </Badge>
                        </IconButton>
                    </div>)}
                </Toolbar>
            </AppBar>
        </>
    )
}

export default Navbar
