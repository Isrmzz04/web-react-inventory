import { CalendarOutlined, CheckCircleOutlined, IdcardOutlined, MailOutlined, SendOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Flex, Form, Input, InputNumber, message, Modal, notification, Row, Select, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { createBorrowing } from '~/stores/global/global.slice';
import { useAppDispatch, useAppSelector } from '~/stores/hook';
import { getAllInventories } from '~/stores/main/inventory/inventory.slice';
import type { IBorrowingRequest, IBorrowingResponse } from '~/types/main/borrowing.types';

const { Option } = Select;
const { Title, Text, Link } = Typography;

const divisiOptions = [
  'IT',
  'Marketing',
  'Finance',
  'Operations',
  'Human Resources',
  'Sales',
  'Customer Service',
  'Research & Development'
];

export default function BorrowingRequest() {
  const [form] = Form.useForm();
  const [selectedInventory, setSelectedInventory] = useState<number | null>(null);
  const [successModal, setSuccessModal] = useState({
    visible: false,
    borrowingCode: ''
  });
  
  const inventoryState = useAppSelector((state) => state.inventory)
  const globalState = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch()

  const [search, setSearch] = useState<string>('')
  const [limit, setLimit] = useState<number>(10)
  const [page, setPage] = useState<number>(1)

  const loadInventory = () => {
    const params = {
      search,
      limit,
      page
    }
    dispatch(getAllInventories(params))
  }

  useEffect(() => {
    loadInventory()
  }, [search, limit, page])

  const getMaxQuantity = () => {
    if (selectedInventory) {
      const inventory = inventoryState.listInventories.find(item => item.id === selectedInventory);
      return inventory ? parseInt(inventory.quantity) : 1;
    }
    return 1;
  };

  const getInventoryName = () => {
    if (selectedInventory) {
      const inventory = inventoryState.listInventories.find(item => item.id === selectedInventory);
      return inventory ? inventory.name : '';
    }
    return '';
  };

  const handleInventoryChange = (value: number) => {
    setSelectedInventory(value);
    form.setFieldsValue({ qty: 1 });
  };

  const handleSubmit = async (values: IBorrowingRequest) => {
    return form?.validateFields().then((values) => {
      values.tgl_peminjaman = dayjs(values.tgl_peminjaman).format('YYYY-MM-DD');
      dispatch(createBorrowing({
        payload: values,
        callback: (code: number, payload: IBorrowingResponse) => {
          if (code === 201) {
            notification.success({
              message: 'Success',
              duration: 2
            })
            setSuccessModal({
              visible: true,
              borrowingCode: payload.kode_peminjaman
            });
            form.resetFields()
            setSelectedInventory(null);
          }
        }
      }))
    }).catch(() => {
      notification.error({
        message: 'Error',
        description: 'Failed to load category details',
        duration: 3
      })
    })
  };

  const handleModalClose = () => {
    setSuccessModal({
      visible: false,
      borrowingCode: ''
    });
  };

  const openTelegramBot = () => {
    window.open('http://t.me/inventaris_pelindo_bot', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Equipment Borrowing Request</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Submit your equipment request with ease. Our team will review and respond within 24 hours.
          </p>
        </div>

        <Row gutter={32} align="top">
          <Col xs={24} lg={16}>
            <Card 
              className="shadow-sm border border-gray-200 rounded-xl"
              bodyStyle={{ padding: '32px' }}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                size="large"
                className="space-y-8"
              >
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h2>
                    <p className="text-sm text-gray-500">Please provide your contact details</p>
                  </div>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label={<span className="text-gray-700 font-medium">Full Name</span>}
                        name="nama"
                        rules={[
                          { required: true, message: 'Please enter your full name!' },
                          { min: 2, message: 'Name must be at least 2 characters!' }
                        ]}
                      >
                        <Input
                          prefix={<UserOutlined className="text-gray-400" />}
                          placeholder="Enter your full name"
                          className="h-11 border-gray-300 rounded-lg focus:border-blue-500 focus:shadow-sm"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label={<span className="text-gray-700 font-medium">Email Address</span>}
                        name="email"
                        rules={[
                          { required: true, message: 'Please enter your email!' },
                          { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                      >
                        <Input
                          prefix={<MailOutlined className="text-gray-400" />}
                          placeholder="your.email@company.com"
                          className="h-11 border-gray-300 rounded-lg focus:border-blue-500 focus:shadow-sm"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label={<span className="text-gray-700 font-medium">Division</span>}
                        name="divisi"
                        rules={[{ required: true, message: 'Please select your division!' }]}
                      >
                        <Select
                          placeholder="Select your division"
                          suffixIcon={<TeamOutlined className="text-gray-400" />}
                          className="h-11"
                          dropdownClassName="rounded-lg shadow-lg border border-gray-200"
                        >
                          {divisiOptions.map(divisi => (
                            <Option key={divisi} value={divisi}>{divisi}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label={<span className="text-gray-700 font-medium">Employee ID</span>}
                        name="nomor_identitas"
                        rules={[
                          { required: true, message: 'Please enter your ID number!' },
                          { min: 5, message: 'ID number must be at least 5 characters!' }
                        ]}
                      >
                        <Input
                          prefix={<IdcardOutlined className="text-gray-400" />}
                          placeholder="Enter your employee ID"
                          className="h-11 border-gray-300 rounded-lg focus:border-blue-500 focus:shadow-sm"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Equipment Selection</h2>
                    <p className="text-sm text-gray-500">Choose the equipment and specify details</p>
                  </div>

                  <Form.Item
                    label={<span className="text-gray-700 font-medium">Available Equipment</span>}
                    name="inventory_id"
                    rules={[{ required: true, message: 'Please select equipment!' }]}
                    className="mb-6"
                  >
                    <Select
                      placeholder="Search and select equipment"
                      onChange={handleInventoryChange}
                      className="h-11"
                      showSearch
                      optionFilterProp="children"
                      dropdownClassName="rounded-lg shadow-lg border border-gray-200"
                      optionLabelProp="label"
                    >
                      {inventoryState.listInventories.map(item => (
                        <Option 
                          key={item.id} 
                          value={item.id}
                          label={item.name}
                        >
                          <div className="flex justify-between items-center py-2">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 text-sm leading-tight">{item.name}</div>
                              <div className="text-xs text-gray-500 mt-1">Stock: {item.quantity} {item.unit}</div>
                            </div>
                            <div className="ml-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                parseInt(item.quantity) > 0 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {parseInt(item.quantity) > 0 ? 'Available' : 'Out of Stock'}
                              </span>
                            </div>
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {selectedInventory && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{getInventoryName()}</p>
                          <p className="text-sm text-gray-600">Maximum available: {getMaxQuantity()} units</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label={<span className="text-gray-700 font-medium">Quantity Needed</span>}
                        name="qty"
                        rules={[
                          { required: true, message: 'Please enter quantity!' },
                          { type: 'number', min: 1, message: 'Quantity must be at least 1!' }
                        ]}
                      >
                        <InputNumber
                          min={1}
                          max={getMaxQuantity()}
                          placeholder="Enter quantity"
                          className="!w-full h-11"
                          disabled={!selectedInventory}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label={<span className="text-gray-700 font-medium">Borrowing Date</span>}
                        name="tgl_peminjaman"
                        rules={[{ required: true, message: 'Please select borrowing date!' }]}
                      >
                        <DatePicker
                          placeholder="Select date"
                          className="w-full h-11"
                          suffixIcon={<CalendarOutlined className="text-gray-400" />}
                          disabledDate={(current) => current && current.valueOf() < Date.now()}
                          format="DD/MM/YYYY"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <div className="pt-4">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={globalState.borrowingRequest.loading}
                    size="large"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 rounded-lg font-medium text-base shadow-sm"
                  >
                    {globalState.borrowingRequest.loading ? 'Processing Request...' : 'Submit Request'}
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Flex vertical gap={10} className="space-y-6">
              <Card 
                title={
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-900">Request Process</span>
                  </div>
                }
                className="shadow-sm border border-gray-200 rounded-xl"
                bodyStyle={{ padding: '20px' }}
              >
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-semibold text-blue-600">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Submit Request</p>
                      <p className="text-xs text-gray-500">Fill and submit the form</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-semibold text-blue-600">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Review Process</p>
                      <p className="text-xs text-gray-500">Team reviews your request</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-semibold text-blue-600">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Notification</p>
                      <p className="text-xs text-gray-500">Receive approval notification</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-semibold text-blue-600">4</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Equipment Pickup</p>
                      <p className="text-xs text-gray-500">Collect your equipment</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card 
                title={
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-900">Important Notes</span>
                  </div>
                }
                className="shadow-sm border border-gray-200 rounded-xl"
                bodyStyle={{ padding: '20px' }}
              >
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Requests are processed within 24 hours during business days</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Valid employee ID is required for verification</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Equipment must be returned in good condition</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Late returns may affect future borrowing privileges</span>
                  </div>
                </div>
              </Card>

              <Card 
                title={
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-900">Need Help?</span>
                  </div>
                }
                className="shadow-sm border border-gray-200 rounded-xl"
                bodyStyle={{ padding: '20px' }}
              >
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">IT Support</p>
                    <p className="text-gray-600">support@company.com</p>
                    <p className="text-gray-600">Ext. 2234</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Equipment Manager</p>
                    <p className="text-gray-600">equipment@company.com</p>
                    <p className="text-gray-600">Ext. 2156</p>
                  </div>
                </div>
              </Card>
            </Flex>
          </Col>
        </Row>
      </div>

      <Modal
        title={null}
        open={successModal.visible}
        onCancel={handleModalClose}
        footer={null}
        centered
        width={500}
        className="success-modal"
      >
        <div className="text-center py-6">
          <CheckCircleOutlined 
            className="text-green-500 text-6xl mb-4" 
          />
          
          <Title level={2} className="text-green-600 mb-2">
            🎉 Request Successful!
          </Title>
          
          <Text className="text-gray-600 text-lg block mb-4">
            Your borrowing request has been submitted successfully
          </Text>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <Text strong className="text-gray-800 block mb-2">
              Your Borrowing Code:
            </Text>
            <div className="bg-white p-3 rounded border-2 border-dashed border-blue-300">
              <Text 
                className="text-2xl font-mono font-bold text-blue-600" 
                copyable={{ text: successModal.borrowingCode }}
              >
                {successModal.borrowingCode}
              </Text>
            </div>
            <Text className="text-sm text-gray-500 mt-2 block">
              💡 Keep this code safe - you'll need it to track your request
            </Text>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
            <Text strong className="text-blue-800 block mb-2">
              📱 Stay Updated with Our Telegram Bot
            </Text>
            <Text className="text-blue-600 text-sm block mb-3">
              Get real-time notifications about your borrowing status, equipment availability, and important updates directly on Telegram!
            </Text>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={openTelegramBot}
              className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
            >
              Join Pelindo Inventory Bot
            </Button>
          </div>

          <Text className="text-gray-500 text-sm block mb-4">
            ✅ What's next? Our team will review your request and contact you within 24 hours
          </Text>

          <Space>
            <Button onClick={handleModalClose} size="large">
              Close
            </Button>
            <Button 
              type="primary" 
              onClick={handleModalClose}
              size="large"
              className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
            >
              Create Another Request
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
}