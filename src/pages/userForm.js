import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography } from '@mui/material';

const UserForm = ({ user = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    username: user.username || '',
    street: user.address?.street || '',
    city: user.address?.city || '',
    company: user.company?.name || '',
    website: user.website || '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user.username) {
      setFormData(prev => ({ ...prev, username: `USER-${prev.name.toLowerCase().replace(/\s/g, '')}` }));
    }
  }, [user.username, formData.name]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!formData.email || !formData.email.includes('@')) newErrors.email = 'Enter a valid email address';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.street) newErrors.street = 'Street is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.company) newErrors.company = 'Company is required';
    if (!formData.website) newErrors.website = 'Website is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...formData, id: user.id });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        fullWidth
        error={!!errors.name}
        helperText={errors.name}
        margin="normal"
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        fullWidth
        error={!!errors.email}
        helperText={errors.email}
        margin="normal"
      />
      <TextField
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
        fullWidth
        error={!!errors.phone}
        helperText={errors.phone}
        margin="normal"
      />
      <TextField
        label="Username"
        name="username"
        value={formData.username}
        disabled
        fullWidth
        margin="normal"
      />
      <TextField
        label="Street"
        name="street"
        value={formData.street}
        onChange={handleChange}
        required
        fullWidth
        error={!!errors.street}
        helperText={errors.street}
        margin="normal"
      />
      <TextField
        label="City"
        name="city"
        value={formData.city}
        onChange={handleChange}
        required
        fullWidth
        error={!!errors.city}
        helperText={errors.city}
        margin="normal"
      />
      <TextField
        label="Company"
        name="company"
        value={formData.company}
        onChange={handleChange}
        fullWidth
        error={!!errors.company}
        helperText={errors.company}
        margin="normal"
      />
      <TextField
        label="Website"
        name="website"
        value={formData.website}
        onChange={handleChange}
        fullWidth
        error={!!errors.website}
        helperText={errors.website}
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" style={{ marginTop: '1rem' }}>
        {user.id ? 'Update' : 'Create'}
      </Button>
    </form>
  );
};

export default UserForm;