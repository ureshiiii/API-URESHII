import express from 'express';
import { 
  createProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from '../controller/products.js';

const router = express.Router();

router.post('/', createProduct);
router.get('/:userId', getProducts);
router.get('/detail/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
