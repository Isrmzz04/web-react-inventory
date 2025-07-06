import { Button, Input, Table, Space, Popconfirm, Tag, Badge, Tooltip } from "antd"
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, CheckOutlined, CloseOutlined, UndoOutlined, UserOutlined, InboxOutlined } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import { useAppSelector } from "~/stores/hook"
import type { IBorrowingResponse } from "~/types/main/borrowing.types"
import dayjs from "dayjs"

const { Search } = Input

interface IBrowseViewExtended {
  limit: number
  setLimit: (size: number) => void
  setPage: (page: number) => void
  handleSearch: (value: string) => void
  handleCreate: () => void
  handleDetail: (id: number, isEdit: boolean) => void
  handleDelete: (id: number) => void
  handleApprove: (id: number, status: string) => void
  handleReturn: (id: number) => void
}

export default function Browse({
  limit,
  setLimit,
  setPage,
  handleSearch,
  handleCreate,
  handleDetail,
  handleDelete,
  handleApprove,
  handleReturn
}: IBrowseViewExtended) {
  const borrowingState = useAppSelector((state) => state.borrowing)

  const getStatusColor = (approved: string) => {
    switch (approved?.toLowerCase()) {
      case 'approved':
        return 'green'
      case 'rejected':
        return 'red'
      case 'pending':
      default:
        return 'orange'
    }
  }

  const getStatusText = (approved: string) => {
    switch (approved?.toLowerCase()) {
      case 'approved':
        return 'Approved'
      case 'rejected':
        return 'Rejected'
      case 'pending':
      default:
        return 'Pending'
    }
  }

  const isOverdue = (tglPeminjaman: string, tglPengembalian: string | null) => {
    if (tglPengembalian) return false
    const borrowDate = dayjs(tglPeminjaman)
    const today = dayjs()
    const daysDiff = today.diff(borrowDate, 'days')
    return daysDiff > 7
  }

  const columns: ColumnsType<IBorrowingResponse> = [
    {
      title: 'No',
      key: 'no',
      width: 60,
      render: (_, __, index) => {
        const currentPage = borrowingState.pagination?.current_page || 1
        return (currentPage - 1) * limit + index + 1
      }
    },
    {
      title: 'Borrowing Code',
      dataIndex: 'kode_peminjaman',
      key: 'kode_peminjaman',
      width: 150,
      render: (text) => (
        <span className="font-mono font-semibold text-blue-600">{text}</span>
      )
    },
    {
      title: 'Borrower Info',
      key: 'borrower',
      width: 200,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <UserOutlined className="text-blue-500" />
            <span className="font-medium">{record.nama}</span>
          </div>
          <div className="text-sm text-gray-600">{record.email}</div>
          <div className="text-sm text-gray-600">{record.divisi}</div>
          <div className="text-xs text-gray-500">ID: {record.nomor_identitas}</div>
        </div>
      )
    },
    {
      title: 'Item',
      key: 'item',
      width: 200,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <InboxOutlined className="text-green-500" />
            <span className="font-medium">{record.inventory.name}</span>
          </div>
          <div className="text-sm text-gray-600">
            Qty: <span className="font-semibold">{record.qty} {record.inventory.unit}</span>
          </div>
        </div>
      )
    },
    {
      title: 'Dates',
      key: 'dates',
      width: 180,
      render: (_, record) => {
        const overdue = isOverdue(record.tgl_peminjaman, record.tgl_pengembalian)
        return (
          <div className="space-y-1">
            <div className="text-sm">
              <span className="text-gray-600">Borrowed: </span>
              <span className="font-medium">{dayjs(record.tgl_peminjaman).format('DD/MM/YYYY')}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Returned: </span>
              {record.tgl_pengembalian ? (
                <Tag color="green">
                  {dayjs(record.tgl_pengembalian).format('DD/MM/YYYY')}
                </Tag>
              ) : (
                <Tag color={overdue ? 'red' : 'orange'}>
                  {overdue ? 'Overdue' : 'Not Returned'}
                </Tag>
              )}
            </div>
          </div>
        )
      }
    },
    {
      title: 'Status',
      dataIndex: 'approved',
      key: 'approved',
      width: 120,
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' }
      ],
      onFilter: (value, record) => record.approved === value,
      render: (approved) => (
        <Tag color={getStatusColor(approved)} className="capitalize">
          {getStatusText(approved)}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" wrap>
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleDetail(record.id, false)}
            title="View Detail"
          />

          {record.approved === 'pending' && (
            <>
              <Tooltip title="Approve">
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={() => handleApprove(record.id, 'approved')}
                  className="bg-green-500 border-green-500"
                />
              </Tooltip>
              <Tooltip title="Reject">
                <Button
                  type="primary"
                  danger
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => handleApprove(record.id, 'rejected')}
                />
              </Tooltip>
            </>
          )}

          {record.approved === 'approved' && !record.tgl_pengembalian && (
            <Tooltip title="Mark as Returned">
              <Button
                type="primary"
                size="small"
                icon={<UndoOutlined />}
                onClick={() => handleReturn(record.id)}
                className="bg-purple-500 border-purple-500"
              />
            </Tooltip>
          )}

          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleDetail(record.id, true)}
            title="Edit"
          />

          <Popconfirm
            title="Delete Borrowing Record"
            description="Are you sure you want to delete this borrowing record?"
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
              placeholder="Search borrowing records..."
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
            New Borrowing
          </Button>
        </div>
      </div>

      <div className="p-6">
        <Table
          columns={columns}
          dataSource={borrowingState.listBorrowings}
          rowKey="id"
          loading={borrowingState.isLoading}
          scroll={{ x: 1600 }}
          pagination={{
            current: borrowingState.pagination?.current_page || 1,
            pageSize: limit,
            total: borrowingState.pagination?.total_records || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} requests`,
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
          rowClassName={(record) => {
            const overdue = isOverdue(record.tgl_peminjaman, record.tgl_pengembalian)
            return `hover:bg-gray-50 ${overdue ? 'bg-red-50' : ''}`
          }}
        />
      </div>
    </div>
  )
}