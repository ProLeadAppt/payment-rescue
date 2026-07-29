export const marketingFaqs = [
  {
    q: 'How does Payment Rescue work?',
    a: 'Create an account, add an invoice and customer phone number, then send an SMS payment reminder from the dashboard. When the invoice is settled, mark it paid.',
  },
  {
    q: 'Does it connect to my accounting software?',
    a: 'Not yet. Invoices are entered manually in the current version.',
  },
  {
    q: 'What does the SMS reminder include?',
    a: 'The default reminder can include the customer name, invoice number, amount, due date, and your business name.',
  },
  {
    q: 'Can I see which reminders were sent?',
    a: 'Yes. Payment Rescue records the reminder against the invoice and updates its reminder count and last-sent time.',
  },
  {
    q: 'Can I mark an invoice as paid?',
    a: 'Yes. You can update an invoice to paid from the dashboard after the payment arrives.',
  },
  {
    q: 'Do reminders send automatically or on weekends?',
    a: 'No. You choose when to send each reminder from the dashboard, so nothing goes out automatically or on a schedule.',
  },
  {
    q: 'Is my data secure?',
    a: 'Account access is authenticated, invoice queries are scoped to the signed-in user, and the app does not store payment card details.',
  },
] as const;
