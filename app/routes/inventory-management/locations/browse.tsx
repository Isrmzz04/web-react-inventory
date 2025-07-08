import { Button, Input, Table, Space, Popconfirm, Tag } from "antd"
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import { useAppSelector } from "~/stores/hook"
import type { ILocationResponse, IBrowseView } from "~/types/main/location.types"
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
  const locationState = useAppSelector((state) => state.location)

  const columns: ColumnsType<ILocationResponse> = [
    {
      title: 'No',
      key: 'no',
      width: 60,
      render: (_, __, index) => {
        const currentPage = locationState.pagination?.current_page || 1
        return (currentPage - 1) * limit + index + 1
      }
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <span className="font-medium">{text}</span>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => (
        <span className="text-gray-600" title={text}>
          {text}
        </span>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
      render: (date) => (
        <Tag color="blue">
          {dayjs(date).format('DD/MM/YYYY')}
        </Tag>
      )
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 150,
      sorter: (a, b) => dayjs(a.updated_at).unix() - dayjs(b.updated_at).unix(),
      render: (date) => (
        <Tag color="green">
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
            title="Delete Location"
            description="Are you sure you want to delete this location?"
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
              placeholder="Search locations..."
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
            Create
          </Button>
        </div>
      </div>
      
      <div className="p-6">
        <Table
          columns={columns}
          dataSource={locationState.listLocations}
          rowKey="id"
          loading={locationState.isLoading}
          scroll={{ x: 800 }}
          pagination={{
            current: locationState.pagination?.current_page || 1,
            pageSize: limit,
            total: locationState.pagination?.total_records || 0,
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