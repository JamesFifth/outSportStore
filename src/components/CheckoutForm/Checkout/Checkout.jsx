// import React from 'react'
import React, { useState, useEffect } from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

// for token use
import { commerce } from '../../../lib/commerce';

import PaymentForm from '../PaymentForm';
import useStyles from './styles';
import AddressForm from '../AddressForm';

const steps = ['Shipping address', 'Payment details'];


const Checkout = ({ cart, onCaptureCheckout, order, error }) => {

  const [activeStep, setActiveStep] = useState(0);
  // checkOutToken
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [shippingData, setShippingData] = useState({});
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    if (cart.id) {
      // generate token
      const generateToken = async () => {
        // if success we set the token
        try {
          // cart id and type of generate to generate token
          const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });
          // console.log(token);
          // set check out token
          setCheckoutToken(token);
        }
        // if fail send error
        catch (error) {
          // if (activeStep !== steps.length) history.push('/');
          history.push('/');
          // console.log(err);
        }
      };

      generateToken();
    }
  }, [cart]);

  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const next = (data) => {
    setShippingData(data);
    nextStep();
  };

  const timeout = () => {
    setTimeout(() => {
      setIsFinished(true);
      // console.log('Hello, World! ')
    }, 3000);
  }

  // show information only when order is done
  let Confirmation = () => (order.customer ? (
    <>
      <div>
        <Typography variant="h5">Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}!</Typography>
        <Divider className={classes.divider} />
        <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
      </div>
      <br />
      <Button component={Link} to="/" variant="outlined" type="button" >Back to home</Button>
    </>
  ) : isFinished ? (
    <>
      <div>
        <Typography variant="h5">Thank you for your purchase</Typography>
        <Divider className={classes.divider} />
      </div>
      <br />
      <Button component={Link} to="/" variant="outlined" type="button" >Back to home</Button>
    </>
  ) : (
        <div className={classes.spinner}>
          <CircularProgress />
        </div>
      ));

  // handle errors
  if (error) {
    Confirmation = () => (
      <>
        <Typography variant="h5">Error: {error}</Typography>
        <br />
        <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
      </>
    );
  }

  const Form = () => activeStep === 0
    ? <AddressForm checkoutToken={checkoutToken} next={next} />
    : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} onCaptureCheckout={onCaptureCheckout} timeout={timeout} />

  return (
    <>
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">Checkout</Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
        </Paper>
      </main>
    </>
  )
}

export default Checkout
