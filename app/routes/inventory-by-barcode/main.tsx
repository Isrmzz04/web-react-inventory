import { Card, Table, Tag, Badge, Space, Button, Avatar, Tooltip, Row, Col, Statistic, Divider, Typography } from "antd";
import { InboxOutlined, UserOutlined, CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, ArrowLeftOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const { Title, Text } = Typography;

interface IInventoryBorrowingResponse {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  created_at: string;
  updated_at: string;
  category_name: string;
  borrowings: Array<{
    id: number;
    kode_peminjaman: string;
    nama: string;
    email: string;
    divisi: string;
    nomor_identitas: string;
    qty: string;
    tgl_peminjaman: string;
    tgl_pengembalian: string | null;
    approved: string | null;
    created_at: string;
    updated_at: string;
  }>;
}

export default function InventoryBorrowingDetailView() {
  // Mock data untuk 1 item inventory dengan banyak peminjam
  const inventoryItem: IInventoryBorrowingResponse = {
    id: 1,
    name: "Laptop Dell Inspiron 15",
    quantity: "25",
    unit: "pcs",
    category_name: "Electronics",
    created_at: "2024-01-01",
    updated_at: "2024-01-15",
    borrowings: [
      {
        id: 1,
        kode_peminjaman: "BRW-20240115-001",
        nama: "John Doe",
        email: "john.doe@company.com",
        divisi: "IT",
        nomor_identitas: "EMP001",
        qty: "2",
        tgl_peminjaman: "2024-01-15",
        tgl_pengembalian: null,
        approved: "approved",
        created_at: "2024-01-15",
        updated_at: "2024-01-15"
      },
      {
        id: 2,
        kode_peminjaman: "BRW-20240110-002",
        nama: "Jane Smith",
        email: "jane.smith@company.com",
        divisi: "Marketing",
        nomor_identitas: "EMP002",
        qty: "1",
        tgl_peminjaman: "2024-01-10",
        tgl_pengembalian: "2024-01-12",
        approved: "approved",
        created_at: "2024-01-10",
        updated_at: "2024-01-12"
      },
      {
        id: 3,
        kode_peminjaman: "BRW-20240114-003",
        nama: "Bob Johnson",
        email: "bob.johnson@company.com",
        divisi: "Sales",
        nomor_identitas: "EMP003",
        qty: "1",
        tgl_peminjaman: "2024-01-14",
        tgl_pengembalian: null,
        approved: "pending",
        created_at: "2024-01-14",
        updated_at: "2024-01-14"
      },
      {
        id: 4,
        kode_peminjaman: "BRW-20240108-004",
        nama: "Alice Brown",
        email: "alice.brown@company.com",
        divisi: "HR",
        nomor_identitas: "EMP004",
        qty: "1",
        tgl_peminjaman: "2024-01-08",
        tgl_pengembalian: null,
        approved: "approved",
        created_at: "2024-01-08",
        updated_at: "2024-01-08"
      },
      {
        id: 5,
        kode_peminjaman: "BRW-20240105-005",
        nama: "Charlie Wilson",
        email: "charlie.wilson@company.com",
        divisi: "Finance",
        nomor_identitas: "EMP005",
        qty: "3",
        tgl_peminjaman: "2024-01-05",
        tgl_pengembalian: "2024-01-07",
        approved: "approved",
        created_at: "2024-01-05",
        updated_at: "2024-01-07"
      },
      {
        id: 6,
        kode_peminjaman: "BRW-20240112-006",
        nama: "Diana Green",
        email: "diana.green@company.com",
        divisi: "Operations",
        nomor_identitas: "EMP006",
        qty: "2",
        tgl_peminjaman: "2024-01-12",
        tgl_pengembalian: null,
        approved: "rejected",
        created_at: "2024-01-12",
        updated_at: "2024-01-12"
      },
      {
        id: 7,
        kode_peminjaman: "BRW-20240101-007",
        nama: "Frank Miller",
        email: "frank.miller@company.com",
        divisi: "IT",
        nomor_identitas: "EMP007",
        qty: "1",
        tgl_peminjaman: "2024-01-01",
        tgl_pengembalian: null,
        approved: "approved",
        created_at: "2024-01-01",
        updated_at: "2024-01-01"
      },
      {
        id: 8,
        kode_peminjaman: "BRW-20240113-008",
        nama: "Grace Lee",
        email: "grace.lee@company.com",
        divisi: "Marketing",
        nomor_identitas: "EMP008",
        qty: "1",
        tgl_peminjaman: "2024-01-13",
        tgl_pengembalian: null,
        approved: "pending",
        created_at: "2024-01-13",
        updated_at: "2024-01-13"
      }
    ]
  };

  const getStatusColor = (approved: string | null) => {
    switch (approved) {
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'pending': return 'orange';
      default: return 'default';
    }
  };

  const getStatusText = (approved: string | null) => {
    switch (approved) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected'; 
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (approved: string | null) => {
    switch (approved) {
      case 'approved': return <CheckCircleOutlined />;
      case 'rejected': return <CloseCircleOutlined />;
      case 'pending': return <ClockCircleOutlined />;
      default: return null;
    }
  };

  const isOverdue = (tglPeminjaman: string, tglPengembalian: string | null) => {
    if (tglPengembalian) return false;
    const borrowDate = dayjs(tglPeminjaman);
    const today = dayjs();
    return today.diff(borrowDate, 'days') > 7;
  };

  const getBorrowingStats = (borrowings: any[]) => {
    const total = borrowings.length;
    const active = borrowings.filter(b => !b.tgl_pengembalian && b.approved === 'approved').length;
    const pending = borrowings.filter(b => b.approved === 'pending').length;
    const returned = borrowings.filter(b => b.tgl_pengembalian).length;
    const overdue = borrowings.filter(b => isOverdue(b.tgl_peminjaman, b.tgl_pengembalian)).length;
    const totalBorrowed = borrowings.reduce((sum, b) => sum + parseInt(b.qty), 0);
    
    return { total, active, pending, returned, overdue, totalBorrowed };
  };

  const stats = getBorrowingStats(inventoryItem.borrowings);
  const availableStock = parseInt(inventoryItem.quantity) - stats.active;

  const borrowingColumns: ColumnsType<any> = [
    {
      title: 'Borrowing Code',
      dataIndex: 'kode_peminjaman',
      key: 'kode_peminjaman',
      width: 160,
      render: (text) => (
        <span className="font-mono text-blue-600 font-medium">{text}</span>
      )
    },
    {
      title: 'Borrower Information',
      key: 'borrower',
      width: 250,
      render: (_, record) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Avatar 
              size="small" 
              style={{ backgroundColor: '#1890ff' }}
            >
              {record.nama.charAt(0).toUpperCase()}
            </Avatar>
            <span className="font-medium text-gray-800">{record.nama}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <MailOutlined />
            <span>{record.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Tag color="blue">{record.divisi}</Tag>
            <Tag color="gray">ID: {record.nomor_identitas}</Tag>
          </div>
        </div>
      )
    },
    {
      title: 'Quantity',
      dataIndex: 'qty',
      key: 'qty',
      width: 100,
      align: 'center',
      render: (qty) => (
        <Badge 
          count={`${qty} ${inventoryItem.unit}`} 
          style={{ backgroundColor: '#52c41a' }} 
        />
      )
    },
    {
      title: 'Borrowing Period',
      key: 'dates',
      width: 200,
      render: (_, record) => {
        const isItemOverdue = isOverdue(record.tgl_peminjaman, record.tgl_pengembalian);
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-sm">
              <CalendarOutlined className="text-blue-500" />
              <span className="text-gray-600">Start:</span>
              <span className="font-medium">{dayjs(record.tgl_peminjaman).format('DD/MM/YYYY')}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              {record.tgl_pengembalian ? (
                <>
                  <CheckCircleOutlined className="text-green-500" />
                  <span className="text-gray-600">Returned:</span>
                  <span className="font-medium text-green-600">
                    {dayjs(record.tgl_pengembalian).format('DD/MM/YYYY')}
                  </span>
                </>
              ) : (
                <>
                  <ClockCircleOutlined className={isItemOverdue ? 'text-red-500' : 'text-orange-500'} />
                  <span className={`font-medium ${isItemOverdue ? 'text-red-600' : 'text-orange-600'}`}>
                    {isItemOverdue ? 'Overdue' : 'Not returned'}
                  </span>
                  {isItemOverdue && (
                    <span className="text-xs text-red-500">
                      ({dayjs().diff(dayjs(record.tgl_peminjaman), 'days')} days)
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        );
      }
    },
    {
      title: 'Status',
      dataIndex: 'approved',
      key: 'approved',
      width: 120,
      align: 'center',
      filters: [
        { text: 'Approved', value: 'approved' },
        { text: 'Pending', value: 'pending' },
        { text: 'Rejected', value: 'rejected' }
      ],
      onFilter: (value, record) => record.approved === value,
      render: (approved) => (
        <Tag 
          color={getStatusColor(approved)} 
          icon={getStatusIcon(approved)}
          className="font-medium"
        >
          {getStatusText(approved)}
        </Tag>
      )
    },
    {
      title: 'Request Date',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (date) => (
        <span className="text-sm text-gray-600">
          {dayjs(date).format('DD/MM/YYYY')}
        </span>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header with Back Button */}
        <Card>
          <div className="flex items-center gap-4 mb-4">
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />}
              className="flex items-center"
            >
              Back to Inventory List
            </Button>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <InboxOutlined className="text-2xl text-blue-600" />
              </div>
              <div>
                <Title level={2} className="mb-1">{inventoryItem.name}</Title>
                <Space size="middle">
                  <Tag color="blue" className="font-medium">{inventoryItem.category_name}</Tag>
                  <Text type="secondary">
                    Created: {dayjs(inventoryItem.created_at).format('DD/MM/YYYY')}
                  </Text>
                  <Text type="secondary">
                    Last Updated: {dayjs(inventoryItem.updated_at).format('DD/MM/YYYY')}
                  </Text>
                </Space>
              </div>
            </div>
          </div>
        </Card>

        {/* Inventory Statistics */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={4}>
            <Card className="text-center">
              <Statistic
                title="Total Stock"
                value={inventoryItem.quantity}
                suffix={inventoryItem.unit}
                valueStyle={{ color: '#1890ff', fontSize: '24px' }}
                prefix={<InboxOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card className="text-center">
              <Statistic
                title="Available"
                value={availableStock}
                suffix={inventoryItem.unit}
                valueStyle={{ color: '#52c41a', fontSize: '24px' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card className="text-center">
              <Statistic
                title="Currently Borrowed"
                value={stats.active}
                suffix={inventoryItem.unit}
                valueStyle={{ color: '#fa8c16', fontSize: '24px' }}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card className="text-center">
              <Statistic
                title="Pending Approval"
                value={stats.pending}
                valueStyle={{ color: '#faad14', fontSize: '24px' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card className="text-center">
              <Statistic
                title="Total Borrowings"
                value={stats.total}
                valueStyle={{ color: '#722ed1', fontSize: '24px' }}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card className="text-center">
              <Statistic
                title="Overdue Items"
                value={stats.overdue}
                valueStyle={{ color: '#f5222d', fontSize: '24px' }}
                prefix={<CloseCircleOutlined />}
              />
              {stats.overdue > 0 && (
                <Text type="danger" className="text-xs">Requires attention</Text>
              )}
            </Card>
          </Col>
        </Row>

        {/* Borrowers List */}
        <Card 
          title={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserOutlined className="text-blue-500" />
                <span>Borrowing History & Current Borrowers</span>
                <Badge count={stats.total} style={{ backgroundColor: '#1890ff' }} />
              </div>
              {stats.overdue > 0 && (
                <Tag color="red" icon={<CloseCircleOutlined />}>
                  {stats.overdue} Overdue Items
                </Tag>
              )}
            </div>
          }
        >
          <Table
            columns={borrowingColumns}
            dataSource={inventoryItem.borrowings}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} borrowing records`
            }}
            rowClassName={(record) => {
              const overdue = isOverdue(record.tgl_peminjaman, record.tgl_pengembalian);
              return `hover:bg-gray-50 ${overdue ? 'bg-red-50 border-l-4 border-red-400' : ''}`;
            }}
            scroll={{ x: 1200 }}
          />
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
                <UserOutlined className="text-2xl text-blue-500 mb-2" />
                <div className="font-medium">Add New Borrowing</div>
                <div className="text-xs text-gray-500">Create borrowing request</div>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-sm transition-all cursor-pointer">
                <CheckCircleOutlined className="text-2xl text-green-500 mb-2" />
                <div className="font-medium">Process Returns</div>
                <div className="text-xs text-gray-500">Mark items as returned</div>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all cursor-pointer">
                <InboxOutlined className="text-2xl text-orange-500 mb-2" />
                <div className="font-medium">Update Stock</div>
                <div className="text-xs text-gray-500">Modify inventory quantity</div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}