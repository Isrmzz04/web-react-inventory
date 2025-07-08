import { Button, Input, Table, Space, Popconfirm, Tag, Badge, QRCode } from "antd"
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, InboxOutlined } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import { useAppSelector } from "~/stores/hook"
import type { IInventoryResponse, IBrowseView } from "~/types/main/inventory.types"
import dayjs from "dayjs"

const { Search } = Input

export default function Browse({
  limit,
  setLimit,
  setPage,
  handleSearch,
  handleCreate,
  handleDetail,
  handleDelete
}: IBrowseView) {
  const inventoryState = useAppSelector((state) => state.inventory)

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'good':
      case 'excellent':
        return 'green'
      case 'fair':
      case 'average':
        return 'orange'
      case 'poor':
      case 'damaged':
        return 'red'
      default:
        return 'blue'
    }
  }

  const getQuantityBadge = (quantity: string) => {
    const qty = parseInt(quantity)
    if (qty <= 10) return { color: 'red', text: 'Low Stock' }
    if (qty <= 50) return { color: 'orange', text: 'Medium Stock' }
    return { color: 'green', text: 'High Stock' }
  }

  const columns: ColumnsType<IInventoryResponse> = [
    {
      title: 'No',
      key: 'no',
      width: 60,
      render: (_, __, index) => {
        const currentPage = inventoryState.pagination?.current_page || 1
        return (currentPage - 1) * limit + index + 1
      }
    },
    {
      title: 'Barcode',
      dataIndex: 'id',
      key: 'id',      
      render: (value, record, number) => {
        return (
          <QRCode value={`https://sistem-inventaris.my.id/be/inventory-by-barcode/${record?.id}` || '-'} />
        )
      }
    },
    {
      title: 'Item Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => (
        <div className="flex items-center gap-2">
          <InboxOutlined className="text-blue-500" />
          <span className="font-medium">{text}</span>
        </div>
      )
    },
    {
      title: 'Category',
      dataIndex: ['category', 'name'],
      key: 'category',
      width: 120,
      render: (text) => (
        <Tag color="blue">{text}</Tag>
      )
    },
    {
      title: 'Location',
      dataIndex: ['location', 'name'],
      key: 'location',
      width: 120,
      render: (text) => (
        <Tag color="purple">{text}</Tag>
      )
    },
    {
      title: 'Supplier',
      dataIndex: ['supplier', 'name'],
      key: 'supplier',
      width: 150,
      render: (text) => (
        <Tag color="cyan">{text}</Tag>
      )
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      sorter: (a, b) => parseInt(a.quantity) - parseInt(b.quantity),
      render: (quantity, record) => {
        const badge = getQuantityBadge(quantity)
        return (
          <div className="text-center">
            <div className="font-semibold text-lg">{quantity} {record.unit}</div>
            <Badge color={badge.color} text={badge.text} />
          </div>
        )
      }
    },
    {
      title: 'Condition',
      dataIndex: 'condition',
      key: 'condition',
      width: 100,
      render: (condition) => (
        <Tag color={getConditionColor(condition)} className="capitalize">
          {condition}
        </Tag>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
      render: (date) => (
        <Tag color="blue">
          {dayjs(date).format('DD/MM/YYYY')}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleDetail(record.id, true)}
            title="Edit"
          />
          <Popconfirm
            title="Delete Inventory Item"
            description="Are you sure you want to delete this inventory item?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
              title="Delete"
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <Search
              placeholder="Search inventory items..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              onChange={(e) => {
                if (!e.target.value) {
                  handleSearch('')
                }
              }}
            />
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleCreate}
            className="flex items-center"
          >
            Add Item
          </Button>
        </div>
      </div>

      <div className="p-6">
        <Table
          columns={columns}
          dataSource={inventoryState.listInventories}
          rowKey="id"
          loading={inventoryState.isLoading}
          scroll={{ x: 1400 }}
          pagination={{
            current: inventoryState.pagination?.current_page || 1,
            pageSize: limit,
            total: inventoryState.pagination?.total_records || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            onShowSizeChange: (current, size) => {
              setLimit(size)
              setPage(1)
            },
            onChange: (page, pageSize) => {
              setPage(page)
              if (pageSize !== limit) {
                setLimit(pageSize)
              }
            },
            pageSizeOptions: ['10', '20', '50', '100'],
            size: 'default',
            className: 'mt-4'
          }}
          className="border border-gray-200 rounded-lg"
          rowClassName="hover:bg-gray-50"
        />
      </div>
    </div>
  )
}