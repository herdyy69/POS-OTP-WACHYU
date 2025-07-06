'use client'

import { toast } from '@/components/ui/alert/toast'
import { DeleteConfirmation } from '@/components/ui/dialog/deleteConfirmation'
import { Icons } from '@/components/ui/icons'
import Cell from '@/components/ui/table/cells'
import DataTable from '@/components/ui/table/dataTable'
import Form from '@/components/ui/form'
import { InsertOrderItems } from '@/schemas/order-items'
import { orderItemsInsert, orderItemsDelete } from '@/service/order-items_service'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface Product {
  guid: string
  name: string
  originalPrice: string
  profitMarginPercentage: string
}

interface OrderItem {
  guid: string
  orderGuid: string
  productGuid: string
  quantity: number
  soldPricePerUnit: string
  productName: string
  totalPrice: string
}

interface OrderData {
  order: {
    guid: string
    storeGuid: string
    orderDate: string
    status: string
    notes: string
    storeName: string
  }
  items: OrderItem[]
}

export const OrderDetail = ({ data, products }: { data: OrderData; products: Product[] }) => {
  const router = useRouter()
  const [showAddForm, setShowAddForm] = useState(false)

  const form = useForm<InsertOrderItems>({
    defaultValues: {
      orderGuid: data.order.guid,
      productGuid: '',
      quantity: 1,
      soldPricePerUnit: '',
    },
    resolver: zodResolver(InsertOrderItems),
  })

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(value))
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }

    return (
      <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusMap[status as keyof typeof statusMap]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const calculateTotal = () => {
    return data.items.reduce((total, item) => total + Number(item.totalPrice), 0)
  }

  const onAddItem = async (formData: InsertOrderItems) => {
    try {
      await orderItemsInsert(formData).then(() => {
        toast.success({
          title: 'Success',
          body: 'Berhasil menambahkan item',
        })
        form.reset({
          orderGuid: data.order.guid,
          productGuid: '',
          quantity: 1,
          soldPricePerUnit: '',
        })
        setShowAddForm(false)
        router.refresh()
      })
    } catch (error) {
      if (error instanceof Error) {
        const validationErrors = JSON.parse(error.message)
        toast.error({
          title: 'Error',
          body: validationErrors[0].message || 'Failed to add item',
        })
      }
    }
  }

  const onDeleteItem = async (guid: string) => {
    try {
      await orderItemsDelete(guid).then(() => {
        toast.success({
          title: 'Success',
          body: 'Berhasil menghapus item',
        })
        router.refresh()
      })
    } catch (error) {
      if (error instanceof Error) {
        const validationErrors = JSON.parse(error.message)
        toast.error({
          title: 'Error',
          body: validationErrors[0].message || 'Failed to delete item',
        })
      }
    }
  }

  const handleProductChange = (productGuid: string) => {
    const product = products.find((p) => p.guid === productGuid)
    if (product) {
      const originalPrice = Number(product.originalPrice)
      const margin = Number(product.profitMarginPercentage)
      const suggestedPrice = originalPrice * (1 + margin / 100)
      form.setValue('productGuid', product.guid)
      form.setValue('soldPricePerUnit', suggestedPrice.toString())
    }
  }

  const columns = [
    {
      header: 'Produk',
      accessorKey: 'productName',
      size: 200,
    },
    {
      header: 'Jumlah',
      accessorKey: 'quantity',
      size: 100,
    },
    {
      header: 'Harga Satuan',
      accessorKey: 'soldPricePerUnit',
      size: 150,
      cell: ({ row }: any) => formatCurrency(row.original.soldPricePerUnit),
    },
    {
      header: 'Total',
      accessorKey: 'totalPrice',
      size: 150,
      cell: ({ row }: any) => formatCurrency(row.original.totalPrice),
    },
    {
      id: 'action',
      header: '',
      cell: ({ row }: any) => (
        <div className='flex justify-end gap-2'>
          <DeleteConfirmation
            trigger={
              <button className='w-max rounded p-2 text-red-600 hover:bg-red-50'>
                <Icons.Trash className='size-4' />
              </button>
            }
            title='Hapus Item'
            description='Apakah Anda yakin ingin menghapus item ini?'
            onConfirm={() => onDeleteItem(row.original.guid)}
          />
        </div>
      ),
      size: 100,
    },
  ]

  return (
    <div className='space-y-6'>
      {/* Order Header */}
      <div className='card space-y-4'>
        <div className='flex flex-col-reverse justify-between gap-2 sm:flex-row sm:items-center'>
          <div className='space-y-1'>
            <h1 className='plabs-title-medium-20 text-greyscale-9'>Detail Pesanan #{data.order.guid}</h1>
            <p className='plabs-body-regular-14 text-greyscale-6'>Detail informasi pesanan penjualan</p>
          </div>
          <div className='flex gap-2'>
            <Link href={`/sales-orders/${data.order.guid}/edit`} className='btn-outline-greyscale'>
              <Icons.Pen className='size-4' />
              Edit Pesanan
            </Link>
            <Link href='/sales-orders' className='btn-green'>
              <Icons.ArrowLeft className='size-4' />
              Kembali
            </Link>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='space-y-4'>
            <div className='space-y-1'>
              <h3 className='plabs-title-medium-14 text-greyscale-7'>Informasi Toko</h3>
              <p className='plabs-title-medium-16 text-greyscale-9'>{data.order.storeName}</p>
            </div>
            <div className='space-y-1'>
              <h3 className='plabs-title-medium-14 text-greyscale-7'>Tanggal Pesanan</h3>
              <p className='plabs-title-medium-16 text-greyscale-9'>{formatDate(data.order.orderDate)}</p>
            </div>
          </div>
          <div className='space-y-4'>
            <div className='space-y-1'>
              <h3 className='plabs-title-medium-14 text-greyscale-7'>Status</h3>
              {getStatusBadge(data.order.status)}
            </div>
            <div className='space-y-1'>
              <h3 className='plabs-title-medium-14 text-greyscale-7'>Total Pesanan</h3>
              <p className='plabs-title-medium-20 text-green-600'>{formatCurrency(calculateTotal().toString())}</p>
            </div>
          </div>
        </div>

        {data.order.notes && (
          <div className='space-y-1'>
            <h3 className='plabs-title-medium-14 text-greyscale-7'>Catatan</h3>
            <p className='plabs-body-regular-14 text-greyscale-6'>{data.order.notes}</p>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className='card space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='plabs-title-medium-18 text-greyscale-9'>Item Pesanan</h2>
          <button onClick={() => setShowAddForm(!showAddForm)} className='btn-green'>
            <Icons.Plus className='size-4' />
            Tambah Item
          </button>
        </div>

        {/* Add Item Form */}
        {showAddForm && (
          <div className='bg-greyscale-1 rounded-lg p-4'>
            <h3 className='plabs-title-medium-16 text-greyscale-9 mb-4'>Tambah Item Baru</h3>
            <Form id='add_item' form={form} onSave={onAddItem}>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                <Form.Select
                  name='productGuid'
                  placeholder='Pilih produk'
                  options={products.map((product) => ({
                    value: product.guid,
                    label: `${product.name} - ${formatCurrency(product.originalPrice)}`,
                  }))}
                  onValueChange={(value) => handleProductChange(value)}
                />
                <Form.Input name='quantity' type='number' placeholder='Jumlah' min='1' />
                <Form.Input name='soldPricePerUnit' type='number' placeholder='Harga jual' step='0.01' />
                <div className='flex gap-2'>
                  <Form.Button type='submit' className='btn-green'>
                    Tambah
                  </Form.Button>
                  <Form.Button type='button' onClick={() => setShowAddForm(false)} className='btn-outline-greyscale'>
                    Batal
                  </Form.Button>
                </div>
              </div>
            </Form>
          </div>
        )}

        {/* Items Table */}
        <DataTable dataQuery={{ data: data.items }} columns={columns} isServerSide={false} emptyText='item pesanan' />
      </div>
    </div>
  )
}
