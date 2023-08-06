import { z } from 'zod';

interface Receipt {
  fields: {
    receipt_id: string;
    name: string;
    email: string;
    treatment: string;
    price: string;
  };
}

const ReceiptZOD = z.object({
  fields: z.object({
    receipt_id: z.string(),
    name: z.string().min(2),
    email: z.string().email(),
    treatment: z.string(),
    price: z.string(),
  }),
});

export const sendToAirtable = async (data: Receipt) => {
  const headers = {
    Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_TOKEN}`,
    'Content-Type': 'application/json',
  };

  const sendResponse: Response = await fetch('https://api.airtable.com/v0/appzpLACufTjr6Q8g/receipts', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(ReceiptZOD.parse(data)),
  });

  if (sendResponse.ok) {
    console.log('Data send successful !');
  } else {
    throw new Error('Sending failed.');
  }
};
