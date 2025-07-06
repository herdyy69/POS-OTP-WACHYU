'use client'

import { toast } from '@/components/ui/alert/toast'
import Form from '@/components/ui/form'
import { Icons } from '@/components/ui/icons'
import { InsertSalesOrders } from '@/schemas/sales-orders'
import { CreateOrderItemForm } from '@/schemas/order-items'
import { salesOrdersInsert } from '@/service/sales-orders_service'
import { orderItemsInsert } from '@/service/order-items_service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'

interface Store {
  guid: string
  name: string
}

interface Product {
  guid: string
  name: string
  originalPrice: string
  profitMarginPercentage: string
}

interface OrderItem {
  id: string // temporary ID for UI
  productGuid: string
  productName: string
  quantity: number
  soldPricePerUnit: string
  totalPrice: number
}

export const FormCreate = ({ stores, products }: { stores: Store[]; products: Product[] }) => {
  const router = useRouter()
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  console.log(stores, products)

  const orderForm = useForm<InsertSalesOrders>({
    defaultValues: {
      storeGuid: '',
      orderDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: '',
    },
    resolver: zodResolver(InsertSalesOrders),
  })

  const itemForm = useForm<CreateOrderItemForm>({
    defaultValues: {
      productGuid: '',
      quantity: 1,
      soldPricePerUnit: '',
    },
    resolver: zodResolver(CreateOrderItemForm),
  })

  // Watch for productId changes to auto-calculate suggested price
  const watchedProductId = useWatch({
    control: itemForm.control,
    name: 'productGuid',
  })

  useEffect(() => {
    if (watchedProductId && watchedProductId !== '' && watchedProductId !== '0') {
      const product = products.find((p) => p.guid === watchedProductId)
      if (product) {
        const originalPrice = Number(product.originalPrice)
        const margin = Number(product.profitMarginPercentage)
        const suggestedPrice = originalPrice * (1 + margin / 100)
        itemForm.setValue('soldPricePerUnit', suggestedPrice.toString())
      }
    }
  }, [watchedProductId, products, itemForm])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const addItem = (data: CreateOrderItemForm) => {
    const product = products.find((p) => p.guid === data.productGuid)
    if (!product) return

    const existingItemIndex = orderItems.findIndex((item) => item.productGuid === data.productGuid)

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...orderItems]
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: Number(data.quantity),
        soldPricePerUnit: data.soldPricePerUnit,
        totalPrice: Number(data.quantity) * Number(data.soldPricePerUnit),
      }
      setOrderItems(updatedItems)
    } else {
      // Add new item
      const newItem: OrderItem = {
        id: Date.now().toString(),
        productGuid: data.productGuid,
        productName: product.name,
        quantity: Number(data.quantity),
        soldPricePerUnit: data.soldPricePerUnit,
        totalPrice: Number(data.quantity) * Number(data.soldPricePerUnit),
      }
      setOrderItems([...orderItems, newItem])
    }

    // Reset form
    itemForm.reset({
      productGuid: '',
      quantity: 1,
      soldPricePerUnit: '',
    })
  }

  const removeItem = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id))
  }

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + item.totalPrice, 0)
  }

  const onSave = async (orderData: InsertSalesOrders) => {
    if (orderItems.length === 0) {
      toast.error({
        title: 'Error',
        body: 'Minimal harus ada 1 item dalam pesanan',
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create order first
      const createdOrder = await salesOrdersInsert(orderData)

      // Then create all items
      const itemPromises = orderItems.map((item) =>
        orderItemsInsert({
          orderGuid: createdOrder.guid,
          productGuid: item.productGuid,
          quantity: item.quantity,
          soldPricePerUnit: item.soldPricePerUnit,
        }),
      )

      await Promise.all(itemPromises)

      toast.success({
        title: 'Success',
        body: 'Berhasil membuat pesanan dengan semua item',
      })

      router.push(`/sales-orders/${createdOrder.guid}`)
    } catch (error) {
      if (error instanceof Error) {
        const validationErrors = JSON.parse(error.message)
        toast.error({
          title: 'Error',
          body: validationErrors[0].message || 'Failed to create order',
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='space-y-6'>
      {/* Order Form */}
      <div className='card space-y-6'>
        <div className='space-y-1'>
          <h1 className='plabs-title-medium-20 text-greyscale-9'>Form Buat Pesanan</h1>
          <p className='plabs-body-regular-14 text-greyscale-6'>Buat pesanan penjualan baru dengan item-item produk.</p>
        </div>

        <div className='bg-primary-background plabs-title-medium-16 text-primary-base w-full rounded-2xl px-3 py-2.5'>
          Data Pesanan
        </div>

        <Form form={orderForm} onSave={() => {}} id='order-form'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-4'>
              <div>
                <label className='plabs-title-medium-14 text-greyscale-7 mb-2 block'>Toko *</label>
                <Form.Select
                  name='storeGuid'
                  placeholder='Pilih toko'
                  options={stores.map((store) => ({ value: store.guid, label: store.name }))}
                />
              </div>

              <div>
                <label className='plabs-title-medium-14 text-greyscale-7 mb-2 block'>Tanggal Order *</label>
                <Form.Input name='orderDate' type='date' />
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='plabs-title-medium-14 text-greyscale-7 mb-2 block'>Status</label>
                <Form.Select
                  name='status'
                  options={[
                    { value: 'pending', label: 'Pending' },
                    { value: 'processing', label: 'Processing' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'cancelled', label: 'Cancelled' },
                  ]}
                />
              </div>

              <div>
                <label className='plabs-title-medium-14 text-greyscale-7 mb-2 block'>Catatan</label>
                <Form.Textarea name='notes' placeholder='Masukkan catatan (opsional)' />
              </div>
            </div>
          </div>
        </Form>
      </div>

      {/* Add Items Form */}
      <div className='card space-y-4'>
        <div className='plabs-title-medium-16 w-full rounded-2xl bg-green-50 px-3 py-2.5 text-green-700'>
          Tambah Item Produk
        </div>

        <Form form={itemForm} onSave={addItem} id='add_item_form'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
            <div>
              <label className='plabs-title-medium-14 text-greyscale-7 mb-2 block'>Produk *</label>
              <Form.Select
                name='productGuid'
                placeholder='Pilih produk'
                options={products.map((product) => ({
                  value: product.guid,
                  label: `${product.name} - ${formatCurrency(Number(product.originalPrice))}`,
                }))}
              />
            </div>

            <div>
              <label className='plabs-title-medium-14 text-greyscale-7 mb-2 block'>Jumlah *</label>
              <Form.Input name='quantity' type='number' placeholder='1' min='1' />
            </div>

            <div>
              <label className='plabs-title-medium-14 text-greyscale-7 mb-2 block'>Harga Jual *</label>
              <Form.Input name='soldPricePerUnit' type='number' placeholder='0' step='0.01' />
            </div>

            <div className='flex items-end'>
              <Form.Button type='submit' className='btn-green w-full items-center justify-center'>
                <Icons.Plus className='size-4' />
                Tambah Item
              </Form.Button>
            </div>
          </div>
        </Form>
      </div>

      {/* Items List */}
      <div className='card space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='plabs-title-medium-16 text-greyscale-9'>Daftar Item ({orderItems.length})</h3>
          <div className='text-right'>
            <p className='plabs-body-regular-12 text-greyscale-6'>Total Pesanan</p>
            <p className='plabs-title-medium-18 text-green-600'>{formatCurrency(calculateTotal())}</p>
          </div>
        </div>

        {orderItems.length === 0 ? (
          <div className='text-greyscale-6 py-8 text-center'>
            <Icons.Plus className='text-greyscale-4 mx-auto mb-4 size-12' />
            <p className='plabs-body-regular-14'>Belum ada item dalam pesanan</p>
            <p className='plabs-body-regular-12'>Tambahkan produk menggunakan form di atas</p>
          </div>
        ) : (
          <div className='space-y-2'>
            {orderItems.map((item) => (
              <div key={item.id} className='bg-greyscale-1 flex items-center justify-between rounded-lg p-4'>
                <div className='flex-1'>
                  <h4 className='plabs-title-medium-14 text-greyscale-9'>{item.productName}</h4>
                  <p className='plabs-body-regular-12 text-greyscale-6'>
                    {item.quantity} x {formatCurrency(Number(item.soldPricePerUnit))}
                  </p>
                </div>
                <div className='mr-4 text-right'>
                  <p className='plabs-title-medium-14 text-greyscale-9'>{formatCurrency(item.totalPrice)}</p>
                </div>
                <button onClick={() => removeItem(item.id)} className='rounded-full p-2 text-red-600 hover:bg-red-50'>
                  <Icons.Trash className='size-4' />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Form */}
      <div className='card'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='plabs-title-medium-16 text-greyscale-9'>Total: {formatCurrency(calculateTotal())}</p>
              <p className='plabs-body-regular-12 text-greyscale-6'>{orderItems.length} item dalam pesanan</p>
            </div>
            <div className='flex gap-2'>
              <button
                type='button'
                onClick={() => router.back()}
                className='btn-outline-greyscale'
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                type='button'
                onClick={() => orderForm.handleSubmit(onSave)()}
                className='btn-green'
                disabled={isSubmitting || orderItems.length === 0}
              >
                {isSubmitting ? 'Menyimpan...' : 'Buat Pesanan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
