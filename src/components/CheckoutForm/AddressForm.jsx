import React, { useState, useEffect } from 'react';

import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';

// in order to use all the shipping locations api data
import { commerce } from '../../lib/commerce';

import FormInput from './CustomTextField';

const AddressForm = ({checkoutToken, next}) => {

  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState('');

  // in order to use form methods
  const methods = useForm();

  const countries = Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name }));
  // console.log(countries);

  const subdivisions = Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name }));
  // console.log(subdivisions);

  const options = shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` }));
  // console.log(shippingOptions);

  // shipping locations
  const fetchShippingCountries = async (checkoutTokenId) => {
    // api call to get countries
    const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);

    // console.log(countries);

    // set shipping countries object
    setShippingCountries(countries);

    // [AL, AT, BA, US ......]
    setShippingCountry(Object.keys(countries)[0]);
  };

  // fetch contries immeditely when AddressForm is ready
  useEffect(() => {
    fetchShippingCountries(checkoutToken.id);
  }, []);

  // fetch the subdivisions of one special country, pass countryCode as parameter
  const fetchSubdivisions = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);
    setShippingSubdivisions(subdivisions);
    setShippingSubdivision(Object.keys(subdivisions)[0]);
  };

  // fetch subdivisions when the shipping country changes
  useEffect(() => {
    // only when shipping country exsist we call fetchSubdivisions to fetch subdivisions
    if (shippingCountry) {
      fetchSubdivisions(shippingCountry);
    }
  }, [shippingCountry]);

  // set shipping options
  const fetchShippingOptions = async (checkoutTokenId, country, stateProvince = null) => {
    const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region: stateProvince });
    setShippingOptions(options);
    setShippingOption(options[0].id);
  };

  // only when shipping subdivision exsist we call fetchShippingOptions to fetch shippingOptions
  useEffect(() => {
    if (shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
  }, [shippingSubdivision]);

  return (
    <>
      <Typography variant="h6" gutterBottom>Shipping address</Typography>
      <FormProvider {...methods}>
        {/* pass data to checkout */}
        <form onSubmit={methods.handleSubmit((data) => next({ ...data, shippingCountry, shippingSubdivision, shippingOption }))}>
          <Grid container spacing={3}>

            {/* 6 Customize components input fields */}
            <FormInput name="firstName" label="First name" />
            <FormInput name="lastName" label="Last name" />
            <FormInput name="address1" label="Address line 1" />
            <FormInput name="email" label="Email" />
            <FormInput name="city" label="City" />
            <FormInput name="zip" label="Zip / Postal code" />

            {/* 3 selects */}

            {/* shipping countries */}
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Country</InputLabel>
              <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            {/* shipping subdivisions */}
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Subdivision</InputLabel>
              <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
                {subdivisions.map((subdivision) => (
                  <MenuItem key={subdivision.id} value={subdivision.id}>
                    {subdivision.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            {/* shipping options */}
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Options</InputLabel>
              <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                {options.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            
          </Grid>

          <br />

          {/* buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button component={Link}  to="/cart" variant="outlined">Back to Cart</Button>
            <Button type="submit" variant="contained" color="primary">Next</Button>
          </div>

        </form>
      </FormProvider>
    </>
  )
}

export default AddressForm
