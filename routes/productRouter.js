const express=require('express')
const router=express.Router()
const {authorizedRoles,authentcation}=require('../middleware/authentication');
const productController=require('../controller/productController')
const {productSchema,updateProductSchema}=require('../helper/validationSchema');
const { validate } = require('../middleware/validation');


/**
 * @swagger
 * definitions:
 *   Product:
 *     properties:
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       quantity:
 *         type: integer
 *       price:
 *         type: integer
 *       CategoryId:
 *         type: integer
 */

/**
 * @swagger
 * definitions:
 *   Products:
 *     properties:
 *       success:
 *         type: boolean
 *       status_code:
 *         type: integer
 *       message:
 *         type: string
 */

/**
 * @swagger
 * definitions:
 *   UpdateProduct:
 *     properties:
 *       id:
 *         type: integer
 *       quantity:
 *         type: integer
 *       price:
 *         type: integer
 */

 /**
 * @swagger
 * /product/updateProduct:
 *   put:
 *     description: Updates a product
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: updateproduct
 *         description: product object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/UpdateProduct'
 *     responses:
 *       200:
 *         description: Successfully created
 */
/**
 * @swagger
 * /product/createProduct:
 *   post:
 *     description: Creates a new product
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Product
 *         description: Product object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Product'
 *     responses:
 *       200:
 *         description: Successfully created
 */

/**
 * @swagger
 * /product/getProducts:
 *   get:
 *     tags:
 *       - Products
 *     description: Returns all products
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of products
 *         schema:
 *           $ref: '#/definitions/Products'
 */

router.post('/createCategory',authentcation,authorizedRoles(['admin']),productController.updateCategory)
router.post('/createProduct',authentcation,authorizedRoles(['admin']),validate(productSchema),productController.updateProduct)
router.put('/updateCategory',authentcation,authorizedRoles(['admin']),productController.updateCategory)
router.put('/updateProduct',authentcation,authorizedRoles(['admin']),validate(updateProductSchema),productController.updateProduct)
router.get('/getProducts',productController.getProducts)
module.exports=router