import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons"
import { Button, Col, Flex, Form, Input, Modal, Row } from "antd"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "~/stores/hook"
import type { IFormView } from "~/types/main/supplier.types"

const { TextArea } = Input

interface Props extends IFormView {
  visible: boolean
  isEdit: boolean
  onClose: () => void
}

export default function FormModal({
  form,
  onSubmit,
  visible,
  isEdit,
  onClose,
}: Props) {
  const supplierState = useAppSelector((state) => state.supplier)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (isEdit && supplierState.detailSupplier?.id) {
      form.setFieldsValue({
        name: supplierState.detailSupplier.name,
        address: supplierState.detailSupplier.address,
        phone: supplierState.detailSupplier.phone,
        email: supplierState.detailSupplier.email
      })
    } else {
      form.resetFields()
    }
  }, [isEdit, supplierState.detailSupplier, form])

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">
            {isEdit ? 'Edit Supplier' : 'Add New Supplier'}
          </span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={700}
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
                label="Supplier Name"
                name="name"
                rules={[
                  { required: true, message: 'Please enter supplier name' },
                  { min: 3, message: 'Supplier name must be at least 3 characters' },
                  { max: 100, message: 'Supplier name must not exceed 100 characters' }
                ]}
              >
                <Input
                  placeholder="Enter supplier name"
                  size="large"
                  maxLength={100}
                  showCount
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: 'Please enter address' },
                  { min: 10, message: 'Address must be at least 10 characters' },
                  { max: 500, message: 'Address must not exceed 500 characters' }
                ]}
              >
                <TextArea
                  placeholder="Enter supplier address"
                  rows={3}
                  size="large"
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  { required: true, message: 'Please enter phone number' },
                  { 
                    pattern: /^[0-9+\-\s()]+$/, 
                    message: 'Please enter a valid phone number' 
                  },
                  { min: 10, message: 'Phone number must be at least 10 characters' },
                  { max: 20, message: 'Phone number must not exceed 20 characters' }
                ]}
              >
                <Input
                  placeholder="Enter phone number"
                  size="large"
                  maxLength={20}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: 'Please enter email address' },
                  { type: 'email', message: 'Please enter a valid email address' },
                  { max: 100, message: 'Email must not exceed 100 characters' }
                ]}
              >
                <Input
                  placeholder="Enter email address"
                  size="large"
                  maxLength={100}
                  type="email"
                />
              </Form.Item>
            </Col>

            <Col span={24} className="mt-6">
              <Form.Item className="mb-0 pt-4">
                <Flex align="center" justify="end">
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={supplierState.isLoading}
                  >
                    {isEdit ? 'Update Supplier' : 'Create Supplier'}
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