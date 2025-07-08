import { ArrowLeftOutlined, CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, InboxOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Card, Col, Row, Space, Spin, Statistic, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useParams } from "react-router";
import { getInventoryByBarcode } from "~/stores/global/global.slice";
import { useAppDispatch, useAppSelector } from "~/stores/hook";
import type { IInventoryBorrowingResponse } from "~/types/main/inventory.types";

const { Title, Text } = Typography;


export default function InventoryBorrowingDetailView() {
  const globalState = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch()
  const { id } = useParams()

  useEffect(() => {
    dispatch(getInventoryByBarcode(Number(id)))
  }, [id])


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
    const total = borrowings?.length;
    const active = borrowings?.filter(b => !b.tgl_pengembalian && b.approved === 'approved').length;
    const pending = borrowings?.filter(b => b.approved === 'pending').length;
    const returned = borrowings?.filter(b => b.tgl_pengembalian).length;
    const overdue = borrowings?.filter(b => isOverdue(b.tgl_peminjaman, b.tgl_pengembalian)).length;
    const totalBorrowed = borrowings?.reduce((sum, b) => sum + parseInt(b.qty), 0);

    return { total, active, pending, returned, overdue, totalBorrowed };
  };

  const stats = getBorrowingStats(globalState?.inventoryByBarcode?.data?.borrowings);
  const availableStock = parseInt(globalState?.inventoryByBarcode?.data?.quantity) - stats.active;

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
          count={`${qty} ${globalState?.inventoryByBarcode?.data?.unit}`}
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
    <Spin spinning={globalState.inventoryByBarcode.loading}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          <Card>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <InboxOutlined className="text-2xl text-blue-600" />
                </div>
                <div>
                  <Title level={2} className="mb-1">{globalState?.inventoryByBarcode?.data?.name}</Title>
                  <Space size="middle">
                    <Tag color="blue" className="font-medium">{globalState?.inventoryByBarcode?.data?.category_name}</Tag>
                    <Text type="secondary">
                      Created: {dayjs(globalState?.inventoryByBarcode?.data?.created_at).format('DD/MM/YYYY')}
                    </Text>
                    <Text type="secondary">
                      Last Updated: {dayjs(globalState?.inventoryByBarcode?.data?.updated_at).format('DD/MM/YYYY')}
                    </Text>
                  </Space>
                </div>
              </div>
            </div>
          </Card>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={4}>
              <Card className="text-center">
                <Statistic
                  title="Total Stock"
                  value={globalState?.inventoryByBarcode?.data?.quantity}
                  suffix={globalState?.inventoryByBarcode?.data?.unit}
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
                  suffix={globalState?.inventoryByBarcode?.data?.unit}
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
                  suffix={globalState?.inventoryByBarcode?.data?.unit}
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
              dataSource={globalState?.inventoryByBarcode?.data?.borrowings}
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

        </div>
      </div>
    </Spin>
  );
}