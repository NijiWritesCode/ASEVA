import { z } from 'zod';

export const expenseSchema = z.object({
  eventId: z.string().uuid('Please select an event'),
  vendorId: z.string().uuid('Invalid vendor').optional().nullable(),
  category: z.string().min(2, 'Category is required'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  amountNaira: z
    .number({ invalid_type_error: 'Please enter a valid amount' })
    .positive('Expense amount must be greater than zero'),
  expenseDate: z.string().min(1, 'Please select the expense date'),
  paymentMethod: z.string().default('bank_transfer'),
  receiptUrl: z.string().url('Invalid receipt URL').optional().nullable(),
});
