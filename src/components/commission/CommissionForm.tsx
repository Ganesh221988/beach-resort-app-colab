import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  FormHelperText
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CommissionFormData } from '../../types/commission';

interface Property {
  id: string;
  name: string;
}

interface Broker {
  id: string;
  name: string;
}

interface CommissionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CommissionFormData) => void;
  initialValues?: Partial<CommissionFormData>;
  properties: Property[];
  brokers: Broker[];
  mode: 'create' | 'edit';
}

const validationSchema = Yup.object({
  propertyId: Yup.string().required('Property is required'),
  brokerId: Yup.string().required('Broker is required'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive'),
  rate: Yup.number()
    .required('Rate is required')
    .min(0, 'Rate must be at least 0')
    .max(100, 'Rate cannot exceed 100'),
  dueDate: Yup.date()
    .required('Due date is required')
    .min(new Date(), 'Due date cannot be in the past'),
  notes: Yup.string()
});

const CommissionForm: React.FC<CommissionFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  properties,
  brokers,
  mode
}) => {
  const formik = useFormik({
    initialValues: {
      propertyId: initialValues?.propertyId || '',
      brokerId: initialValues?.brokerId || '',
      amount: initialValues?.amount || 0,
      rate: initialValues?.rate || 0,
      dueDate: initialValues?.dueDate || new Date().toISOString().split('T')[0],
      notes: initialValues?.notes || ''
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      onClose();
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Create Commission' : 'Edit Commission'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                error={Boolean(
                  formik.touched.propertyId && formik.errors.propertyId
                )}
              >
                <InputLabel>Property</InputLabel>
                <Select
                  name="propertyId"
                  value={formik.values.propertyId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Property"
                >
                  {properties.map((property) => (
                    <MenuItem key={property.id} value={property.id}>
                      {property.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.propertyId && formik.errors.propertyId && (
                  <FormHelperText>{formik.errors.propertyId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                error={Boolean(formik.touched.brokerId && formik.errors.brokerId)}
              >
                <InputLabel>Broker</InputLabel>
                <Select
                  name="brokerId"
                  value={formik.values.brokerId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Broker"
                >
                  {brokers.map((broker) => (
                    <MenuItem key={broker.id} value={broker.id}>
                      {broker.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.brokerId && formik.errors.brokerId && (
                  <FormHelperText>{formik.errors.brokerId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="amount"
                label="Amount"
                type="number"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.amount && formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="rate"
                label="Rate (%)"
                type="number"
                value={formik.values.rate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.rate && formik.errors.rate)}
                helperText={formik.touched.rate && formik.errors.rate}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="dueDate"
                label="Due Date"
                type="date"
                value={formik.values.dueDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.dueDate && formik.errors.dueDate)}
                helperText={formik.touched.dueDate && formik.errors.dueDate}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="notes"
                label="Notes"
                multiline
                rows={4}
                value={formik.values.notes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.notes && formik.errors.notes)}
                helperText={formik.touched.notes && formik.errors.notes}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={formik.isSubmitting}
          >
            {mode === 'create' ? 'Create' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CommissionForm;
