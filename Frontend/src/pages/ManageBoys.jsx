import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Box,
  Grid,
  Card,
  CardContent,
  Switch,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  Block as BlockIcon,
  CheckCircle as UnblockIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

const ManageBoys = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBoy, setSelectedBoy] = useState(null);
  const [actionType, setActionType] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch delivery boys from API
  const fetchDeliveryBoys = async () => {

    try {
                const token = localStorage.getItem("token");
      setLoading(true);
    const params = new URLSearchParams({
  // page: currentPage,
  // limit: usersPerPage,
  search: search,
  status: status,
}).toString();

const res = await fetch(`http://localhost:5000/viewboys?${params}`, {
  headers: { Authorization: `Bearer ${token}` },
});

      console.log(res);
      
      const data = await res.json();
      

      if (data.success) {
        setDeliveryBoys(data.deliveryBoys);
        setTotalCount(data.totalCount);
        setTotalPages(data.totalPages);
      } else {
        setError('Failed to fetch delivery boys');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


const updateBlockStatus = async (boyId, isBlocked) => {
  
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5000/boys-block-unblock/${boyId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isBlocked }), // pass only the toggle flag
    });

    const data = await response.json();
    console.log(data);
    

      setSnackbar({
        open: true,
        message: `Delivery boy ${isBlocked ? "blocked" : "unblocked"} successfully`,
        severity: "success",
      });
      fetchDeliveryBoys(); // refresh list
    
  } catch (err) {
    console.log(err);
    
    setSnackbar({
      open: true,
      message: "Error updating status",
      severity: "error",
    });
    console.error(err);
  }
};


  // Handle status change
  const handleStatusChange = (boy, action) => {
    setSelectedBoy(boy);
    setActionType(action);
    setOpenDialog(true);
  };

  // Confirm status change
  const confirmStatusChange = () => {
    updateBlockStatus(selectedBoy._id, actionType === 'block');
    setOpenDialog(false);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate statistics
  const activeBoys = deliveryBoys.filter(boy => !boy.isBlocked).length;
  const blockedBoys = deliveryBoys.filter(boy => boy.isBlocked).length;

  // Fetch data when parameters change
  useEffect(() => {
    fetchDeliveryBoys();
  }, [page, rowsPerPage, search, status]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
        Delivery Management
      </Typography>
      
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Delivery Boys
              </Typography>
              <Typography variant="h4" component="div" sx={{ color: '#3498db' }}>
                {totalCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Boys
              </Typography>
              <Typography variant="h4" component="div" sx={{ color: '#2ecc71' }}>
                {activeBoys}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Blocked Boys
              </Typography>
              <Typography variant="h4" component="div" sx={{ color: '#e74c3c' }}>
                {blockedBoys}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 2 }} elevation={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search by name, email or phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
                <MenuItem value="unblocked">Unblocked</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Delivery Boys Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : (
        <>
          <TableContainer component={Paper} elevation={3}>
            <Table sx={{ minWidth: 650 }} aria-label="delivery boys table">
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Contact Info</strong></TableCell>
                  <TableCell><strong>Liscence Details</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deliveryBoys.map((boy) => (
                  <TableRow key={boy._id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {boy.fullName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Joined: {new Date(boy.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography>{boy.phone}</Typography>
                      <Typography color="textSecondary">{boy.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{boy.vehicleType}</Typography>
                      <Typography color="textSecondary">{boy.licenseNumber}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={boy.isBlocked ? "Blocked" : "Active"}
                        color={boy.isBlocked ? "error" : "success"}
                        variant={boy.isBlocked ? "filled" : "outlined"}
                      />
                    </TableCell>
                    <TableCell>
                      {boy.isBlocked ? (
                        <IconButton 
                          color="success" 
                          onClick={() => handleStatusChange(boy, 'unblock')}
                          title="Unblock delivery boy"
                        >
                          <UnblockIcon />
                        </IconButton>
                      ) : (
                        <IconButton 
                          color="error" 
                          onClick={() => handleStatusChange(boy, 'block')}
                          title="Block delivery boy"
                        >
                          <BlockIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ mt: 2 }}
          />
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm {actionType === 'block' ? 'Block' : 'Unblock'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to {actionType} {selectedBoy?.name}?
            {actionType === 'block' ? ' They will not be able to accept new deliveries.' : ' They will be able to accept deliveries again.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={confirmStatusChange} autoFocus color={actionType === 'block' ? 'error' : 'success'}>
            Confirm {actionType}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};


export default ManageBoys
