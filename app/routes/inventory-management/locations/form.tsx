import { Button, Col, Flex, Form, Input, Modal, Row } from "antd"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "~/stores/hook"
import type { IFormView } from "~/types/main/location.types"

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
  const locationState = useAppSelector((state) => state.location)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (isEdit && locationState.detailLocation?.id) {
      form.setFieldsValue({
        name: locationState.detailLocation.name,
        description: locationState.detailLocation.description
      })
    } else {
      form.resetFields()
    }
  }, [isEdit, locationState.detailLocation, form])

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">
            {isEdit ? 'Edit Location' : 'Add New Location'}
          </span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
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
                label="Location Name"
                name="name"
                rules={[
                  { required: true, message: 'Please enter location name' },
                  { min: 3, message: 'Location name must be at least 3 characters' },
                  { max: 50, message: 'Location name must not exceed 50 characters' }
                ]}
              >
                <Input
                  placeholder="Enter location name"
                  size="large"
                  maxLength={50}
                  showCount
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: 'Please enter description' },
                  { min: 10, message: 'Description must be at least 10 characters' },
                  { max: 500, message: 'Description must not exceed 500 characters' }
                ]}
              >
                <TextArea
                  placeholder="Enter location description"
                  rows={4}
                  size="large"
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </Col>

            <Col span={24} className="mt-10">
              <Form.Item className="mb-0 pt-4">
                <Flex align="center" justify="end">
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={locationState.isLoading}
                  >
                    {isEdit ? 'Update Location' : 'Create Location'}
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