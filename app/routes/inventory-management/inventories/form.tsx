import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons"
import { Button, Col, Flex, Form, Input, Modal, Row, Select, InputNumber } from "antd"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "~/stores/hook"
import type { IFormView } from "~/types/main/inventory.types"
import type { ICategoryResponse } from "~/types/main/category.types"
import type { ILocationResponse } from "~/types/main/location.types"
import type { ISupplierResponse } from "~/types/main/supplier.types"

const { Option } = Select

interface Props extends IFormView {
  visible: boolean
  isEdit: boolean
  onClose: () => void
  categories: ICategoryResponse[]
  locations: ILocationResponse[]
  suppliers: ISupplierResponse[]
}

export default function FormModal({
  form,
  onSubmit,
  visible,
  isEdit,
  onClose,
  categories,
  locations,
  suppliers
}: Props) {
  const inventoryState = useAppSelector((state) => state.inventory)
  const dispatch = useAppDispatch()

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
    { value: 'damaged', label: 'Damaged' }
  ]

  const unitOptions = [
    { value: 'pcs', label: 'Pieces (pcs)' },
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'g', label: 'Gram (g)' },
    { value: 'l', label: 'Liter (l)' },
    { value: 'ml', label: 'Milliliter (ml)' },
    { value: 'm', label: 'Meter (m)' },
    { value: 'cm', label: 'Centimeter (cm)' },
    { value: 'box', label: 'Box' },
    { value: 'pack', label: 'Pack' },
    { value: 'set', label: 'Set' },
    { value: 'unit', label: 'Unit' }
  ]

  useEffect(() => {
    if (isEdit && inventoryState.detailInventory?.id) {
      form.setFieldsValue({
        name: inventoryState.detailInventory.name,
        category_id: inventoryState.detailInventory.category_id,
        location_id: inventoryState.detailInventory.location_id,
        supplier_id: inventoryState.detailInventory.supplier_id,
        quantity: inventoryState.detailInventory.quantity,
        unit: inventoryState.detailInventory.unit,
        condition: inventoryState.detailInventory.condition
      })
    } else {
      form.resetFields()
    }
  }, [isEdit, inventoryState.detailInventory, form])

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">
            {isEdit ? 'Edit Inventory Item' : 'Add New Inventory Item'}
          </span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
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
                label="Item Name"
                name="name"
                rules={[
                  { required: true, message: 'Please enter item name' },
                  { min: 3, message: 'Item name must be at least 3 characters' },
                  { max: 100, message: 'Item name must not exceed 100 characters' }
                ]}
              >
                <Input
                  placeholder="Enter inventory item name"
                  size="large"
                  maxLength={100}
                  showCount
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Category"
                name="category_id"
                rules={[
                  { required: true, message: 'Please select a category' }
                ]}
              >
                <Select
                  placeholder="Select category"
                  size="large"
                  showSearch
                  optionFilterProp="children"
                >
                  {categories.map((category) => (
                    <Option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Location"
                name="location_id"
                rules={[
                  { required: true, message: 'Please select a location' }
                ]}
              >
                <Select
                  placeholder="Select location"
                  size="large"
                  showSearch
                  optionFilterProp="children"
                >
                  {locations.map((location) => (
                    <Option key={location.id} value={location.id.toString()}>
                      {location.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Supplier"
                name="supplier_id"
                rules={[
                  { required: true, message: 'Please select a supplier' }
                ]}
              >
                <Select
                  placeholder="Select supplier"
                  size="large"
                  showSearch
                  optionFilterProp="children"
                >
                  {suppliers.map((supplier) => (
                    <Option key={supplier.id} value={supplier.id.toString()}>
                      {supplier.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[
                  { required: true, message: 'Please enter quantity' },
                  { pattern: /^\d+$/, message: 'Quantity must be a valid number' }
                ]}
              >
                <Input
                  placeholder="Enter quantity"
                  size="large"
                  type="number"
                  min={1}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Unit"
                name="unit"
                rules={[
                  { required: true, message: 'Please select a unit' }
                ]}
              >
                <Select
                  placeholder="Select unit"
                  size="large"
                  showSearch
                  optionFilterProp="children"
                >
                  {unitOptions.map((unit) => (
                    <Option key={unit.value} value={unit.value}>
                      {unit.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Condition"
                name="condition"
                rules={[
                  { required: true, message: 'Please select item condition' }
                ]}
              >
                <Select
                  placeholder="Select condition"
                  size="large"
                >
                  {conditionOptions.map((condition) => (
                    <Option key={condition.value} value={condition.value}>
                      {condition.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24} className="mt-6">
              <Form.Item className="mb-0 pt-4">
                <Flex align="center" justify="end">
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={inventoryState.isLoading}
                  >
                    {isEdit ? 'Update Inventory Item' : 'Create Inventory Item'}
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