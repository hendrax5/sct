import axios from 'axios'

const XENDIT_API_KEY = process.env.XENDIT_API_KEY || 'xnd_development'
const XENDIT_BASE_URL = 'https://api.xendit.co'

const xenditClient = axios.create({
  baseURL: XENDIT_BASE_URL,
  auth: {
    username: XENDIT_API_KEY,
    password: '',
  },
})

export async function createInvoice(payload: {
  externalId: string
  amount: number
  description: string
  invoiceDuration?: number
  customerEmail?: string
  paymentMethods?: string[]
}) {
  try {
    const response = await xenditClient.post('/v2/invoices', {
      external_id: payload.externalId,
      amount: payload.amount,
      description: payload.description,
      invoice_duration: payload.invoiceDuration || 86400,
      customer_email: payload.customerEmail,
      payment_methods: payload.paymentMethods || ['CREDIT_CARD', 'BANK_TRANSFER', 'E_WALLET'],
      currency: 'IDR',
    })

    return {
      success: true,
      data: {
        invoiceId: response.data.id,
        invoiceUrl: response.data.invoice_url,
        status: response.data.status,
        externalId: response.data.external_id,
        amount: response.data.amount,
      },
    }
  } catch (error: any) {
    console.error('Xendit create invoice error:', error.response?.data || error.message)
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create invoice',
    }
  }
}

export async function getInvoice(invoiceId: string) {
  try {
    const response = await xenditClient.get(`/v2/invoices/${invoiceId}`)

    return {
      success: true,
      data: {
        invoiceId: response.data.id,
        status: response.data.status,
        amount: response.data.amount,
        paidAmount: response.data.paid_amount,
        externalId: response.data.external_id,
      },
    }
  } catch (error: any) {
    console.error('Xendit get invoice error:', error.response?.data || error.message)
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch invoice',
    }
  }
}

export function verifyXenditWebhook(xCallback: string, requestBody: string): boolean {
  try {
    const crypto = require('crypto')
    const hash = crypto
      .createHmac('sha256', XENDIT_API_KEY)
      .update(requestBody)
      .digest('hex')

    return hash === xCallback
  } catch (error) {
    console.error('Xendit webhook verification error:', error)
    return false
  }
}
