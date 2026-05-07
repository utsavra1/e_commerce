import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
    definition: {
    openapi: '3.0.0',
    info: {
      title: 'Estore API',
      version: '1.0.0',
      description: 'REST API documentation for Estore e-commerce application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        RegisterInput: {
          type: 'object',
          required: ['username', 'email', 'password', 'phone', 'dob'],
          properties: {
            username: { type: 'string', example: 'utsav' },
            email: { type: 'string', example: 'utsav@gmail.com' },
            password: { type: 'string', example: 'secret123' },
            phone: { type: 'string', example: '9800000001' },
            dob: { type: 'string', example: '2000-05-15' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'utsav@gmail.com' },
            password: { type: 'string', example: 'secret123' },
          },
        },
        //cart
        AddToCartInput: {
          type: 'object',
          required: ['product_id', 'quantity'],
          properties: {
            product_id: { type: 'integer', example: 1 },
            quantity: { type: 'integer', example: 2 },
          },
        },
        UpdateCartInput: {
          type: 'object',
          required: ['quantity'],
          properties: {
            quantity: { type: 'integer', example: 3 },
          },
        },
        // order 
        PlaceOrderInput: {
          type: 'object',
          required: ['order_description'],
          properties: {
            order_description: { type: 'string', example: 'My first order' },
          },
        },
        // review
        CreateReviewInput: {
          type: 'object',
          required: ['rating', 'comments'],
          properties: {
            rating: { type: 'integer', example: 5 },
            comments: { type: 'string', example: 'Amazing product!' },
          },
        },

        // admin 
        CreateProductInput: {
          type: 'object',
          required: ['product_name', 'product_description', 'product_price', 'stock', 'subcategory_id'],
          properties: {
            product_name: { type: 'string', example: 'Samsung S24' },
            product_description: { type: 'string', example: 'Latest Samsung flagship' },
            product_price: { type: 'number', example: 95000 },
            stock: { type: 'integer', example: 40 },
            subcategory_id: { type: 'integer', example: 1 },
          },
        },
        UpdateProductInput: {
          type: 'object',
          properties: {
            product_name: { type: 'string', example: 'Samsung S24 Ultra' },
            product_description: { type: 'string', example: 'Updated description' },
            product_price: { type: 'number', example: 105000 },
            stock: { type: 'integer', example: 50 },
            subcategory_id: { type: 'integer', example: 1 },
          },
        },
        //  admin category 
        CreateCategoryInput: {
          type: 'object',
          required: ['category_name'],
          properties: {
            category_name: { type: 'string', example: 'Electronics' },
          },
        },
        UpdateCategoryInput: {
          type: 'object',
          properties: {
            category_name: { type: 'string', example: 'Updated Electronics' },
          },
        },
        // admin subcategory 
        CreateSubcategoryInput: {
          type: 'object',
          required: ['subcategory_name', 'category_id'],
          properties: {
            subcategory_name: { type: 'string', example: 'Phones' },
            category_id: { type: 'integer', example: 1 },
          },
        },
        UpdateSubcategoryInput: {
          type: 'object',
          properties: {
            subcategory_name: { type: 'string', example: 'Updated Phones' },
            category_id: { type: 'integer', example: 1 },
          },
        },
      },
    },
    paths: {
        '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterInput' },
              },
            },
          },
          responses: {
            201: { description: 'User registered successfully' },
            400: { description: 'Validation failed' },
            409: { description: 'Email or phone already registered' },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login and get JWT token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginInput' },
              },
            },
          },
          responses: {
            200: { description: 'Login successful, returns token' },
            400: { description: 'Validation failed' },
            401: { description: 'Invalid credentials' },
            404: { description: 'User not found' },
          },
        },
      },
      // PRODUCTS 
      '/products': {
        get: {
          tags: ['Products'],
          summary: 'Get all products',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'List of all products' },
            401: { description: 'No token provided' },
          },
        },
      },
      '/products/{id}': {
        get: {
          tags: ['Products'],
          summary: 'Get product by ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: { description: 'Product found' },
            400: { description: 'Invalid product ID' },
            404: { description: 'Product not found' },
          },
        },
      },
      '/products/subcategory/{subcategoryId}': {
        get: {
          tags: ['Products'],
          summary: 'Get products by subcategory',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'subcategoryId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: { description: 'Products in subcategory' },
            404: { description: 'Subcategory not found' },
          },
        },
      },
      '/products/category/{categoryId}': {
        get: {
          tags: ['Products'],
          summary: 'Get products by category',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'categoryId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: { description: 'Products in category' },
            404: { description: 'Category not found' },
          },
        },
      },
      // CART 
      '/cart/add': {
        post: {
          tags: ['Cart'],
          summary: 'Add product to cart',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AddToCartInput' },
              },
            },
          },
          responses: {
            200: { description: 'Product added to cart' },
            400: { description: 'Insufficient stock' },
            404: { description: 'Product not found' },
          },
        },
      },
      '/cart/me': {
        get: {
          tags: ['Cart'],
          summary: 'Get my cart',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Cart with all items and total' },
            404: { description: 'Cart is empty' },
          },
        },
      },
      '/cart/remove/{cart_item_id}': {
        delete: {
          tags: ['Cart'],
          summary: 'Remove item from cart',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'cart_item_id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: { description: 'Item removed from cart' },
            404: { description: 'Cart item not found' },
          },
        },
      },
      '/cart/update/{cart_item_id}': {
        patch: {
          tags: ['Cart'],
          summary: 'Update cart item quantity',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'cart_item_id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateCartInput' },
              },
            },
          },
          responses: {
            200: { description: 'Cart item updated' },
            400: { description: 'Insufficient stock' },
            404: { description: 'Cart item not found' },
          },
        },
      },
      // ORDERS 
      '/orders/place': {
        post: {
          tags: ['Orders'],
          summary: 'Place order from cart',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PlaceOrderInput' },
              },
            },
          },
          responses: {
            201: { description: 'Order placed successfully' },
            400: { description: 'Cart is empty or insufficient stock' },
          },
        },
      },
      '/orders/me': {
        get: {
          tags: ['Orders'],
          summary: 'Get all my orders',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'List of all orders' },
            404: { description: 'No orders found' },
          },
        },
      },
      '/orders/{order_id}': {
        get: {
          tags: ['Orders'],
          summary: 'Get single order detail',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'order_id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: { description: 'Order detail with all items' },
            404: { description: 'Order not found' },
          },
        },
      },
      // REVIEWS 
      '/reviews/{product_id}': {
        post: {
          tags: ['Reviews'],
          summary: 'Write a product review',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'product_id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateReviewInput' },
              },
            },
          },
          responses: {
            201: { description: 'Review submitted successfully' },
            409: { description: 'Already reviewed this product' },
          },
        },
        get: {
          tags: ['Reviews'],
          summary: 'Get all reviews for a product',
          parameters: [
            {
              name: 'product_id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: { description: 'Reviews with average rating' },
            404: { description: 'No reviews found' },
          },
        },
      },
      '/reviews/delete/{review_id}': {
        delete: {
          tags: ['Reviews'],
          summary: 'Delete my review',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'review_id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: { description: 'Review deleted successfully' },
            404: { description: 'Review not found' },
          },
        },
      },
      // ADMIN
      '/admin/products': {
        post: {
          tags: ['Admin'],
          summary: 'Create a new product',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateProductInput' },
              },
            },
          },
          responses: {
            201: { description: 'Product created successfully' },
            403: { description: 'Access denied. Admins only' },
            404: { description: 'Subcategory not found' },
          },
        },
      },
      '/admin/products/{product_id}': {
        patch: {
          tags: ['Admin'],
          summary: 'Update a product',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'product_id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateProductInput' },
              },
            },
          },
          responses: {
            200: { description: 'Product updated successfully' },
            404: { description: 'Product not found' },
          },
        },
        delete: {
          tags: ['Admin'],
          summary: 'Delete a product',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'product_id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: { description: 'Product deleted successfully' },
            404: { description: 'Product not found' },
          },
        },
      },
      '/admin/categories': {
        post: {
          tags: ['Admin'],
          summary: 'Create a new category',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateCategoryInput' },
              },
            },
          },
          responses: {
            201: { description: 'Category created successfully' },
            409: { description: 'Category already exists' },
          },
        },
      },
      '/admin/categories/{category_id}': {
        patch: {
          tags: ['Admin'],
          summary: 'Update a category',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'category_id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateCategoryInput' },
              },
            },
          },
          responses: {
            200: { description: 'Category updated successfully' },
            404: { description: 'Category not found' },
          },
        },
        delete: {
          tags: ['Admin'],
          summary: 'Delete a category',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'category_id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: { description: 'Category deleted successfully' },
            400: { description: 'Cannot delete — has subcategories' },
            404: { description: 'Category not found' },
          },
        },
      },
      '/admin/subcategories': {
        post: {
          tags: ['Admin'],
          summary: 'Create a new subcategory',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateSubcategoryInput' },
              },
            },
          },
          responses: {
            201: { description: 'Subcategory created successfully' },
            404: { description: 'Category not found' },
            409: { description: 'Subcategory already exists' },
          },
        },
      },
      '/admin/subcategories/{subcategory_id}': {
        patch: {
          tags: ['Admin'],
          summary: 'Update a subcategory',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'subcategory_id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateSubcategoryInput' },
              },
            },
          },
          responses: {
            200: { description: 'Subcategory updated successfully' },
            404: { description: 'Subcategory not found' },
          },
        },
        delete: {
          tags: ['Admin'],
          summary: 'Delete a subcategory',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'subcategory_id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: { description: 'Subcategory deleted successfully' },
            400: { description: 'Cannot delete — has products' },
            404: { description: 'Subcategory not found' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);
   