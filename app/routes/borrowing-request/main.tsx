import { Form, Input, Select, DatePicker, InputNumber, Button, Card, Row, Col, Steps, notification, Divider } from "antd";
import { UserOutlined, InboxOutlined, CalendarOutlined, CheckOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";

const { Option } = Select;

interface IBorrowingRequest {
  nama: string;
  email: string;
  divisi: string;
  nomor_identitas: string;
  inventory_id: number;
  qty: number;
  tgl_peminjaman: any;
  tgl_pengembalian: any;
}

export default function BorrowingRequest() {
  const [form] = Form.useForm<IBorrowingRequest>();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inventoryItems = [
    { id: 1, name: "Laptop Dell Inspiron", available: 15, unit: "pcs" },
    { id: 2, name: "Projector Epson", available: 3, unit: "pcs" },
    { id: 3, name: "Camera Canon", available: 8, unit: "pcs" },
    { id: 4, name: "Microphone Wireless", available: 12, unit: "pcs" },
    { id: 5, name: "Tablet iPad", available: 6, unit: "pcs" }
  ];

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
  ];

  const onFinish = async (values: IBorrowingRequest) => {
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Borrowing request submitted:', values);

      notification.success({
        message: 'Request Submitted Successfully!',
        description: 'Your borrowing request has been submitted and is pending approval.',
        duration: 4
      });

      setCurrentStep(3);
      form.resetFields();

    } catch (error) {
      notification.error({
        message: 'Submission Failed',
        description: 'Please try again later.',
        duration: 3
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields(['nama', 'email', 'divisi', 'nomor_identitas']);
      } else if (currentStep === 1) {
        await form.validateFields(['inventory_id', 'qty']);
      } else if (currentStep === 2) {
        await form.validateFields(['tgl_peminjaman']);
      }
      setCurrentStep(currentStep + 1);
    } catch (error) {
      // Validation failed, stay on current step
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const getAvailableQuantity = (inventoryId: number) => {
    const inventory = inventoryItems.find(item => item.id === inventoryId);
    return inventory ? inventory.available : 0;
  };

  const steps = [
    {
      title: 'Personal Info',
      icon: <UserOutlined />,
      description: 'Your information'
    },
    {
      title: 'Select Item',
      icon: <InboxOutlined />,
      description: 'Choose inventory'
    },
    {
      title: 'Schedule',
      icon: <CalendarOutlined />,
      description: 'Set dates'
    },
    {
      title: 'Complete',
      icon: <CheckOutlined />,
      description: 'Request submitted'
    }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
              <p className="text-gray-600">Please provide your personal details</p>
            </div>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  label="Full Name"
                  name="nama"
                  rules={[
                    { required: true, message: 'Please enter your full name' },
                    { min: 3, message: 'Name must be at least 3 characters' }
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Enter your full name"
                    prefix={<UserOutlined className="text-gray-400" />}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="Email Address"
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Enter your email address"
                    type="email"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Division"
                  name="divisi"
                  rules={[{ required: true, message: 'Please select your division' }]}
                >
                  <Select
                    size="large"
                    placeholder="Select your division"
                    showSearch
                    optionFilterProp="children"
                  >
                    {divisiOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Employee ID"
                  name="nomor_identitas"
                  rules={[
                    { required: true, message: 'Please enter your employee ID' },
                    { min: 3, message: 'Employee ID must be at least 3 characters' }
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Enter your employee ID"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Select Inventory Item</h3>
              <p className="text-gray-600">Choose the item you want to borrow</p>
            </div>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  label="Inventory Item"
                  name="inventory_id"
                  rules={[{ required: true, message: 'Please select an item' }]}
                >
                  <Select
                    size="large"
                    placeholder="Select inventory item"
                    showSearch
                    optionFilterProp="children"
                  >
                    {inventoryItems.map(item => (
                      <Option key={item.id} value={item.id}>
                        <div className="flex justify-between items-center">
                          <span>{item.name}</span>
                          <span className="text-green-600 text-sm">
                            Available: {item.available} {item.unit}
                          </span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="Quantity"
                  name="qty"
                  rules={[
                    { required: true, message: 'Please enter quantity' },
                    { type: 'number', min: 1, message: 'Quantity must be at least 1' }
                  ]}
                >
                  <InputNumber
                    size="large"
                    placeholder="Enter quantity"
                    min={1}
                    style={{ width: '100%' }}
                    onChange={(value) => {
                      const inventoryId = form.getFieldValue('inventory_id');
                      if (inventoryId && value) {
                        const available = getAvailableQuantity(inventoryId);
                        if (value > available) {
                          form.setFields([
                            {
                              name: 'qty',
                              errors: [`Cannot exceed available quantity (${available})`]
                            }
                          ]);
                        }
                      }
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Schedule Information</h3>
              <p className="text-gray-600">Set your borrowing and return dates</p>
            </div>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Borrowing Date"
                  name="tgl_peminjaman"
                  rules={[{ required: true, message: 'Please select borrowing date' }]}
                >
                  <DatePicker
                    size="large"
                    placeholder="Select borrowing date"
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Expected Return Date"
                  name="tgl_pengembalian"
                >
                  <DatePicker
                    size="large"
                    placeholder="Select return date (optional)"
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                    disabledDate={(current) => {
                      const borrowingDate = form.getFieldValue('tgl_peminjaman');
                      return current && borrowingDate && current < borrowingDate;
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Important Notes:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Please return the item in the same condition as borrowed</li>
                <li>• You will be responsible for any damage or loss</li>
                <li>• Late returns may affect future borrowing privileges</li>
                <li>• Your request will be reviewed by the admin</li>
              </ul>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="text-green-500 text-6xl mb-4">
              <CheckOutlined />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">Request Submitted Successfully!</h3>
            <p className="text-gray-600 text-lg">
              Your borrowing request has been submitted and is now pending approval.
            </p>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-green-800">
                You will receive an email notification once your request is reviewed.
              </p>
            </div>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                setCurrentStep(0);
                form.resetFields();
              }}
            >
              Submit Another Request
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Inventory Borrowing Request
            </h1>
            <p className="text-gray-600">
              Submit your request to borrow inventory items
            </p>
          </div>

          <Steps
            current={currentStep}
            items={steps}
            className="mb-8"
          />

          <Divider />

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="mt-6"
          >
            {renderStepContent()}

            {currentStep < 3 && (
              <Divider />
            )}

            {currentStep < 2 && (
              <div className="flex justify-end space-x-3">
                {currentStep > 0 && (
                  <Button size="large" onClick={handlePrev}>
                    Previous
                  </Button>
                )}
                <Button type="primary" size="large" onClick={handleNext}>
                  Next
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="flex justify-end space-x-3">
                <Button size="large" onClick={handlePrev}>
                  Previous
                </Button>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  Submit Request
                </Button>
              </div>
            )}
          </Form>
        </Card>
      </div>
    </div>
  );
}