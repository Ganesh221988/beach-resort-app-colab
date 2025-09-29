import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Typography,
  Button
} from '@mui/material';
import { Edit as EditIcon, Payment as PaymentIcon } from '@mui/icons-material';
import { Commission } from '../../types/commission';
import { format } from 'date-fns';

interface CommissionListProps {
  commissions: Commission[];
  userRole: 'admin' | 'owner' | 'broker';
  onEdit?: (commission: Commission) => void;
  onPay?: (commission: Commission) => void;
}

const CommissionList: React.FC<CommissionListProps> = ({
  commissions,
  userRole,
  onEdit,
  onPay
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    return status === 'PAID' ? 'success' : 'warning';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Property</TableCell>
              {userRole !== 'broker' && <TableCell>Broker</TableCell>}
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Rate</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {commissions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((commission) => (
                <TableRow hover key={commission.id}>
                  <TableCell>
                    <Typography variant="body2">
                      {commission.property?.name}
                      <br />
                      <Typography variant="caption" color="textSecondary">
                        {commission.property?.location}
                      </Typography>
                    </Typography>
                  </TableCell>
                  {userRole !== 'broker' && (
                    <TableCell>
                      <Typography variant="body2">
                        {commission.broker?.name}
                        <br />
                        <Typography variant="caption" color="textSecondary">
                          {commission.broker?.email}
                        </Typography>
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell align="right">
                    {formatCurrency(commission.amount)}
                  </TableCell>
                  <TableCell align="right">{commission.rate}%</TableCell>
                  <TableCell>
                    {format(new Date(commission.dueDate), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={commission.status}
                      color={getStatusColor(commission.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {userRole === 'admin' && onEdit && (
                      <IconButton
                        size="small"
                        onClick={() => onEdit(commission)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    {userRole === 'owner' &&
                      commission.status === 'PENDING' &&
                      onPay && (
                        <Button
                          startIcon={<PaymentIcon />}
                          variant="contained"
                          size="small"
                          onClick={() => onPay(commission)}
                        >
                          Pay
                        </Button>
                      )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={commissions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default CommissionList;
