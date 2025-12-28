import { z } from 'zod';
import { insertUserSchema, insertProductSchema, insertCartItemSchema, insertOrderSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products',
      responses: {
        200: z.array(z.any()), // Product[]
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:id',
      responses: {
        200: z.any(), // Product
        404: errorSchemas.notFound,
      },
    },
  },
  cart: {
    list: {
      method: 'GET' as const,
      path: '/api/cart',
      responses: {
        200: z.array(z.any()), // CartItem[]
      },
    },
    addItem: {
      method: 'POST' as const,
      path: '/api/cart',
      input: insertCartItemSchema,
      responses: {
        200: z.any(), // CartItem
      },
    },
    removeItem: {
      method: 'DELETE' as const,
      path: '/api/cart/:id',
      responses: {
        200: z.void(),
      },
    },
  },
  orders: {
    create: {
      method: 'POST' as const,
      path: '/api/orders',
      input: z.object({}), // Usually empty body for "checkout cart"
      responses: {
        201: z.any(), // Order
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/orders',
      responses: {
        200: z.array(z.any()), // Order[]
      },
    },
  },
  auth: {
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.any(), // User | null
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
