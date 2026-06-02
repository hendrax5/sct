import axios from 'axios'

const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY || 'key'
const RAJAONGKIR_BASE_URL = 'https://api.rajaongkir.com/starter'

const rajaongkirClient = axios.create({
  baseURL: RAJAONGKIR_BASE_URL,
  headers: {
    key: RAJAONGKIR_API_KEY,
  },
})

export async function getShippingCost(payload: {
  origin: number
  destination: number
  weight: number
  courier: string
}) {
  try {
    const response = await rajaongkirClient.post('/cost', payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    if (response.data.rajaongkir.status.code !== 200) {
      return {
        success: false,
        error: response.data.rajaongkir.status.description,
      }
    }

    const costs = response.data.rajaongkir.results[0].costs.map((cost: any) => ({
      service: cost.service,
      description: cost.description,
      cost: cost.cost[0]?.value || 0,
      etd: cost.cost[0]?.etd || '0',
    }))

    return {
      success: true,
      data: costs,
    }
  } catch (error: any) {
    console.error('RajaOngkir error:', error.response?.data || error.message)
    return {
      success: false,
      error: error.response?.data?.rajaongkir?.status?.description || 'Failed to fetch shipping cost',
    }
  }
}

export async function getProvinces() {
  try {
    const response = await rajaongkirClient.get('/province')

    if (response.data.rajaongkir.status.code !== 200) {
      return { success: false, error: response.data.rajaongkir.status.description }
    }

    return {
      success: true,
      data: response.data.rajaongkir.results,
    }
  } catch (error: any) {
    console.error('RajaOngkir get provinces error:', error.message)
    return { success: false, error: 'Failed to fetch provinces' }
  }
}

export async function getCities(provinceId: number) {
  try {
    const response = await rajaongkirClient.get('/city', {
      params: { province: provinceId },
    })

    if (response.data.rajaongkir.status.code !== 200) {
      return { success: false, error: response.data.rajaongkir.status.description }
    }

    return {
      success: true,
      data: response.data.rajaongkir.results,
    }
  } catch (error: any) {
    console.error('RajaOngkir get cities error:', error.message)
    return { success: false, error: 'Failed to fetch cities' }
  }
}
