import React, { useState, useEffect, Fragment, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEllipsisV, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import { Dialog, Transition } from '@headlessui/react';
import { TextField, InputAdornment, IconButton, MenuItem, Pagination } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';


const ManageLocation = () => {
  const [cities, setCities] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCity, setNewCity] = useState({ city: '', isActive: true });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const token = localStorage.getItem('token');

  const fetchCities = async () => {
    try {
      setError(null);
      const { data } = await axios.get('http://localhost:5000/viewlocations', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery,
          status: filterStatus,
        },
      });
      setCities(data.cities || []);
      setTotalPages(data.totalPages ); // Update total pages based on the response
    } catch (error) {
      setError('Failed to load cities');
      toast.error(error.response?.data?.error || 'Could not fetch cities');
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, [currentPage, searchQuery, filterStatus]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleAddCity = async () => {
    if (!newCity.city.trim()) {
      toast.error('City name cannot be empty');
      return;
    }

    try {
      await axios.post('http://localhost:5000/addlocations', newCity, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('City added successfully');
      setIsAddDialogOpen(false);
      setNewCity({ city: '', isActive: true });
      fetchCities();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add city');
    }
  };

  const toggleCityStatus = async (cityId) => {
    try {
      await axios.put(`http://localhost:5000/location-status/${cityId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`City status updated`);
      fetchCities();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update status');
    } finally {
      setOpenMenuId(null);
    }
  };

  const handleDeleteCity = async (cityId) => {
    if (!window.confirm('Are you sure you want to delete this city?')) return;

    try {
      await axios.delete(`http://localhost:5000/delete-location/${cityId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('City deleted successfully');
      fetchCities();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete city');
    } finally {
      setOpenMenuId(null);
    }
  };

  const toggleMenu = (cityId, event) => {
    event.stopPropagation();
    setOpenMenuId(openMenuId === cityId ? null : cityId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && menuRefs.current[openMenuId] && 
          !menuRefs.current[openMenuId].contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="text-red-500">
            <p>{error}</p>
            <button
              onClick={fetchCities}
              className="mt-2 text-blue-600 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header and Search + Dropdown + Add Button */}
      <div className="flex flex-col md:flex-row gap-4 items-center mb-6 w-full">
        <div className="w-full md:w-[50%]">
          <TextField
            label="Search Cities"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </div>
        <div className="w-full md:w-[30%]">
          <TextField
            select
            label="Filter"
            value={filterStatus}
            onChange={handleFilterChange}
            variant="outlined"
            fullWidth
          >
            <MenuItem value="all">Show All</MenuItem>
            <MenuItem value="blocked">Blocked</MenuItem>
            <MenuItem value="unblocked">Unblocked</MenuItem>
          </TextField>
        </div>
        <div className="w-full md:w-[20%]">
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 w-full"
          >
            <FaPlus className="text-sm" /> Add City
          </button>
        </div>
      </div>

      {/* Cities Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cities.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  No cities found
                </td>
              </tr>
            ) : (
              cities.map((city) => (
                <tr key={city._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{city.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${city.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {city.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div ref={el => menuRefs.current[city._id] = el} className="relative inline-block text-left">
                      <button
                        onClick={(e) => toggleMenu(city._id, e)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 transition-colors duration-200"
                      >
                        <FaEllipsisV className="text-gray-500" />
                      </button>

                      {openMenuId === city._id && (
                        <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                          <div className="py-1">
                            <button
                              onClick={(e) => { toggleCityStatus(city._id); e.stopPropagation(); }}
                              className="text-gray-700 block px-4 py-2 text-sm"
                            >
                              {city.isActive ? 'Block' : 'Unblock'}
                            </button>
                            <button
                              onClick={(e) => { handleDeleteCity(city._id); e.stopPropagation(); }}
                              className="text-red-600 block px-4 py-2 text-sm"
                            >
                              <FaTrash className="inline-block mr-2" /> Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </div>

      {/* Add City Dialog */}
      <Transition show={isAddDialogOpen} as={Fragment}>
  <Dialog as="div" className="relative z-10" onClose={() => setIsAddDialogOpen(false)}>
    <Transition.Child
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0  bg-opacity-30" />
    </Transition.Child>

    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 w-full sm:w-96">
          <Dialog.Title className="text-xl font-semibold mb-4">Add City</Dialog.Title>
          <TextField
            label="City Name"
            variant="outlined"
            value={newCity.city}
            onChange={(e) => setNewCity({ ...newCity, city: e.target.value })}
            fullWidth
            required
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={handleAddCity}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Add City
            </button>
          </div>
        </Dialog.Panel>
      </Transition.Child>
    </div>
  </Dialog>
</Transition>
    </div>
  );
};

export default ManageLocation;
