import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons"
import { Button, Col, Flex, Form, Input, Modal, Row, Select, DatePicker, InputNumber } from "antd"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "~/stores/hook"
import type { IFormView } from "~/types/main/borrowing.types"
import type { IInventoryResponse } from "~/types/main/inventory.types"
import dayjs from "dayjs"

const { Option } = Select
const { TextArea } = Input

interface Props extends IFormView {
  visible: boolean
  isEdit: boolean
  onClose: () => void
  inventories: IInventoryResponse[]
}

export default function FormModal({
  form,
  onSubmit,
  visible,
  isEdit,
  onClose,
  inventories
}: Props) {
  const borrowingState = useAppSelector((state) => state.borrowing)
  const dispatch = useAppDispatch()

  const divisiOptions = [
    { value: 'IT', label: 'Information Technology' },
    { value: 'HR', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Admin', label: 'Administration' },
    { value: 'Production', label: 'Production' },
    { value: 'QA', label: 'Quality Assurance' },
    { value: 'Logistics', label: 'Logistics' }
  ]

  const statusOptions = [
    { value: 1, label: 'Disetujui' },
    { value: 0, label: 'Ditolak' }
  ]

  useEffect(() => {
    if (isEdit && borrowingState.detailBorrowing?.id) {
      form.setFieldsValue({
        kode_peminjaman: borrowingState.detailBorrowing.kode_peminjaman,
        nama: borrowingState.detailBorrowing.nama,
        email: borrowingState.detailBorrowing.email,
        divisi: borrowingState.detailBorrowing.divisi,
        nomor_identitas: borrowingState.detailBorrowing.nomor_identitas,
        inventory_id: parseInt(borrowingState.detailBorrowing.inventory_id),
        qty: parseInt(borrowingState.detailBorrowing.qty),
        tgl_peminjaman: borrowingState.detailBorrowing.tgl_peminjaman ? dayjs(borrowingState.detailBorrowing.tgl_peminjaman) : null,
        tgl_pengembalian: borrowingState.detailBorrowing.tgl_pengembalian ? dayjs(borrowingState.detailBorrowing.tgl_pengembalian) : null,
        approved: borrowingState.detailBorrowing.approved
      })
    } else {
      form.resetFields()
    }
  }, [isEdit, borrowingState.detailBorrowing, form])

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  const getAvailableQuantity = (inventoryId: number) => {
    const inventory = inventories.find(inv => inv.id === inventoryId)
    return inventory ? parseInt(inventory.quantity) : 0
  }

  const validateReturnDate = (rule: any, value: any) => {
    if (value) {
      const borrowingDate = form.getFieldValue('tgl_peminjaman')
      if (borrowingDate && value.isBefore(borrowingDate, 'day')) {
        return Promise.reject('Return date cannot be earlier than borrowing date')
      }
    }
    return Promise.resolve()
  }

  const isApproved = isEdit && borrowingState.detailBorrowing?.approved !== null && borrowingState.detailBorrowing?.approved !== undefined

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">
            {isEdit ? 'Edit Borrowing Request' : 'Create New Borrowing Request'}
          </span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={900}
      destroyOnClose
      maskClosable={false}
    >
      <div className="pt-4">
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
        >
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <Form.Item
                label="Borrowing Code"
                name="kode_peminjaman"
              >
                <Input
                  placeholder="-"
                  size="large"
                  maxLength={100}
                  disabled
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Borrower Name"
                name="nama"
                rules={[
                  { required: true, message: 'Please enter borrower name' },
                  { min: 3, message: 'Name must be at least 3 characters' },
                  { max: 100, message: 'Name must not exceed 100 characters' }
                ]}
              >
                <Input
                  placeholder="Enter borrower full name"
                  size="large"
                  maxLength={100}
                  disabled={isApproved}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: 'Please enter email address' },
                  { type: 'email', message: 'Please enter a valid email address' }
                ]}
              >
                <Input
                  placeholder="Enter email address"
                  size="large"
                  type="email"
                  disabled={isApproved}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Division"
                name="divisi"
                rules={[
                  { required: true, message: 'Please select division' }
                ]}
              >
                <Select
                  placeholder="Select division"
                  size="large"
                  showSearch
                  optionFilterProp="children"
                  disabled={isApproved}
                >
                  {divisiOptions.map((division) => (
                    <Option key={division.value} value={division.value}>
                      {division.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Identity Number"
                name="nomor_identitas"
                rules={[
                  { required: true, message: 'Please enter identity number' },
                  { min: 5, message: 'Identity number must be at least 5 characters' },
                  { max: 20, message: 'Identity number must not exceed 20 characters' }
                ]}
              >
                <Input
                  placeholder="Enter employee ID or identity number"
                  size="large"
                  maxLength={20}
                  disabled={isApproved}
                />
              </Form.Item>
            </Col>

            <Col span={16}>
              <Form.Item
                label="Inventory Item"
                name="inventory_id"
                rules={[
                  { required: true, message: 'Please select inventory item' }
                ]}
              >
                <Select
                  placeholder="Select inventory item to borrow"
                  size="large"
                  showSearch
                  optionFilterProp="children"
                  disabled={isApproved}
                >
                  {inventories.map((inventory) => (
                    <Option key={inventory.id} value={inventory.id}>
                      <div className="flex justify-between">
                        <span>{inventory.name}</span>
                        <span className="text-gray-500">
                          Available: {inventory.quantity} {inventory.unit}
                        </span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Quantity"
                name="qty"
                rules={[
                  { required: true, message: 'Please enter quantity' },
                  { type: 'number', min: 1, message: 'Quantity must be at least 1' }
                ]}
              >
                <InputNumber
                  placeholder="Enter quantity"
                  size="large"
                  min={1}
                  style={{ width: '100%' }}
                  disabled={isApproved}
                  onChange={(value) => {
                    const inventoryId = form.getFieldValue('inventory_id')
                    if (inventoryId && value) {
                      const available = getAvailableQuantity(inventoryId)
                      if (value > available) {
                        form.setFields([
                          {
                            name: 'qty',
                            errors: [`Cannot exceed available quantity (${available})`]
                          }
                        ])
                      }
                    }
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Borrowing Date"
                name="tgl_peminjaman"
                rules={[
                  { required: true, message: 'Please select borrowing date' }
                ]}
              >
                <DatePicker
                  placeholder="Select borrowing date"
                  size="large"
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  onChange={() => {
                    form.validateFields(['tgl_pengembalian'])
                  }}
                  disabled={isApproved}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Return Date"
                name="tgl_pengembalian"
                rules={[
                  { validator: validateReturnDate }
                ]}
              >
                <DatePicker
                  placeholder="Select return date (optional)"
                  size="large"
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  disabled={isApproved}
                />
              </Form.Item>
            </Col>

            {isEdit && (
              <Col span={12}>
                {borrowingState.detailBorrowing?.approved !== null && 
                 borrowingState.detailBorrowing?.approved !== undefined ? (
                  <Form.Item label="Status">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        +borrowingState.detailBorrowing.approved === 1 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {+borrowingState.detailBorrowing.approved === 1 ? 'Disetujui' : 'Ditolak'}
                      </span>
                      <span className="text-gray-600 text-sm">
                        Data ini sudah {+borrowingState.detailBorrowing.approved === 1 ? 'disetujui' : 'ditolak'} dan tidak dapat diubah lagi
                      </span>
                    </div>
                  </Form.Item>
                ) : (
                  <Form.Item
                    label="Status"
                    name="approved"
                    rules={[
                      { required: true, message: 'Please select status' }
                    ]}
                  >
                    <Select
                      placeholder="Select approval status"
                      size="large"
                    >
                      {statusOptions.map((status) => (
                        <Option key={status.value} value={status.value}>
                          {status.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </Col>
            )}

            <Col span={24} className="mt-6">
              <Form.Item className="mb-0 pt-4">
                <Flex align="center" justify="end">
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={borrowingState.isLoading}
                    disabled={isEdit && borrowingState.detailBorrowing?.approved !== null && borrowingState.detailBorrowing?.approved !== undefined}
                  >
                    {isEdit ? 'Update Borrowing Request' : 'Create Borrowing Request'}
                  </Button>
                </Flex>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  )
}