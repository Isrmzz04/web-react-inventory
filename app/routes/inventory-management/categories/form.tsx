import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons"
import { Button, Col, Flex, Form, Input, Modal, Row } from "antd"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "~/stores/hook"
import type { IFormView } from "~/types/main/category.types"

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
  const categoryState = useAppSelector((state) => state.category)
  const dispatch = useAppDispatch()


  useEffect(() => {
    if (isEdit && categoryState.detailCategory?.id) {
      form.setFieldsValue({
        name: categoryState.detailCategory.name,
        description: categoryState.detailCategory.description
      })
    } else {
      form.resetFields()
    }
  }, [isEdit, categoryState.detailCategory, form])


  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">
            {isEdit ? 'Edit Category' : 'Add New Category'}
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
                label="Category Name"
                name="name"
                rules={[
                  { required: true, message: 'Please enter category name' },
                  { min: 3, message: 'Category name must be at least 3 characters' },
                  { max: 50, message: 'Category name must not exceed 50 characters' }
                ]}
              >
                <Input
                  placeholder="Enter category name"
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
                  placeholder="Enter category description"
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
                    loading={categoryState.isLoading}
                  >
                    {isEdit ? 'Update Category' : 'Create Category'}
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