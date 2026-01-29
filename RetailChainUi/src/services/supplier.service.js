import { axiosPrivate } from './api/axiosClient';

const supplierService = {
  getAllSuppliers: async () => {
    return axiosPrivate.get('/supplier');
  }
};

export default supplierService;
