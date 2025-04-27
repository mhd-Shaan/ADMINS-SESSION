import React, { useState, useEffect, Fragment, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEllipsisV, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import { Dialog, Transition } from '@headlessui/react';

const ManageLocation = () => {
  const [cities, setCities] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCity, setNewCity] = useState({ city: '', isActive: true });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});
  const token = localStorage.getItem('token');

  const fetchCities = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get('http://localhost:5000/viewlocations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCities(data.citys || []);
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
  }, []);

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
      await axios.put(
        `http://localhost:5000/location-status/${cityId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('City status updated');
      fetchCities();
    } catch (error) {
      console.log(error);
      
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
      {/* Header and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cities Management</h1>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <FaPlus className="text-sm" /> Add City
        </button>
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
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCityStatus(city._id);
                              }}
                              className={`flex items-center w-full px-4 py-2 text-sm ${
                                city.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                              }`}
                            >
                              {city.isActive ? (
                                <>
                                  <FaTimes className="mr-2" /> Block
                                </>
                              ) : (
                                <>
                                  <FaCheck className="mr-2" /> Unblock
                                </>
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCity(city._id);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <FaTrash className="mr-2" /> Delete
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

      {/* Add City Dialog */}
      <Transition appear show={isAddDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsAddDialogOpen(false)}
        >
          {/* Remove the black background overlay */}
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {/* Empty div - we removed the overlay */}
              <div className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                &#8203;
              </div>
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Add New City
                  </Dialog.Title>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">City Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={newCity.name}
                      onChange={(e) => setNewCity({...newCity, city: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mt-4 flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={newCity.isActive}
                      onChange={(e) => setNewCity({...newCity, isActive: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Active City
                    </label>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleAddCity}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition> 
    </div>
  );
};

export default ManageLocation;
