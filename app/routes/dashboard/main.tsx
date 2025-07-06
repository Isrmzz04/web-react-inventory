import Base from "~/components/shared/base/base";
import { Card, Row, Col, Statistic, Progress, Tag, List, Avatar } from "antd";
import {
  InboxOutlined,
  AppstoreOutlined,
  EnvironmentOutlined,
  ShopOutlined,
  SwapOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

export default function Dashboard() {
  const dashboardData = {
    totalInventories: 626,
    totalCategories: 5,
    totalLocations: 5,
    totalSuppliers: 5,
    totalBorrowings: 5,
    pendingApproval: 1,
    borrowingsToday: 0,
    mostBorrowed: {
      name: "odio",
      totalBorrowed: 3
    }
  };

  const recentActivity = [
    {
      id: 1,
      action: "New borrowing request",
      user: "John Doe",
      item: "Laptop Dell",
      time: "2 hours ago",
      status: "pending"
    },
    {
      id: 2,
      action: "Item returned",
      user: "Jane Smith",
      item: "Projector Epson",
      time: "5 hours ago",
      status: "completed"
    },
    {
      id: 3,
      action: "New inventory added",
      user: "Admin",
      item: "Mouse Wireless",
      time: "1 day ago",
      status: "completed"
    }
  ];

  const lowStockItems = [
    { name: "Keyboard Mechanical", stock: 5, unit: "pcs" },
    { name: "Monitor 24 inch", stock: 3, unit: "pcs" },
    { name: "Printer Ink Cartridge", stock: 8, unit: "pcs" }
  ];

  return (
    <Base>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back! Here's what's happening with your inventory.
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {dayjs().format('DD/MM/YYYY HH:mm')}
            </div>
          </div>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-md transition-shadow">
              <Statistic
                title="Total Inventories"
                value={dashboardData.totalInventories}
                prefix={<InboxOutlined className="text-blue-500" />}
                valueStyle={{ color: '#1890ff' }}
              />
              <div className="mt-2 text-xs text-gray-500">
                <ArrowUpOutlined className="text-green-500" /> +12% from last month
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-md transition-shadow">
              <Statistic
                title="Total Categories"
                value={dashboardData.totalCategories}
                prefix={<AppstoreOutlined className="text-green-500" />}
                valueStyle={{ color: '#52c41a' }}
              />
              <div className="mt-2 text-xs text-gray-500">
                Active categories
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-md transition-shadow">
              <Statistic
                title="Total Locations"
                value={dashboardData.totalLocations}
                prefix={<EnvironmentOutlined className="text-purple-500" />}
                valueStyle={{ color: '#722ed1' }}
              />
              <div className="mt-2 text-xs text-gray-500">
                Storage locations
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-md transition-shadow">
              <Statistic
                title="Total Suppliers"
                value={dashboardData.totalSuppliers}
                prefix={<ShopOutlined className="text-orange-500" />}
                valueStyle={{ color: '#fa8c16' }}
              />
              <div className="mt-2 text-xs text-gray-500">
                Active suppliers
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-md transition-shadow">
              <Statistic
                title="Total Borrowings"
                value={dashboardData.totalBorrowings}
                prefix={<SwapOutlined className="text-cyan-500" />}
                valueStyle={{ color: '#13c2c2' }}
              />
              <div className="mt-2 text-xs text-gray-500">
                All time borrowings
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-md transition-shadow">
              <Statistic
                title="Pending Approval"
                value={dashboardData.pendingApproval}
                prefix={<ClockCircleOutlined className="text-yellow-500" />}
                valueStyle={{ color: '#faad14' }}
              />
              <div className="mt-2 text-xs text-gray-500">
                Requires attention
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-md transition-shadow">
              <Statistic
                title="Borrowings Today"
                value={dashboardData.borrowingsToday}
                prefix={<CalendarOutlined className="text-red-500" />}
                valueStyle={{ color: '#f5222d' }}
              />
              <div className="mt-2 text-xs text-gray-500">
                New requests today
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-md transition-shadow bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
              <div className="flex items-center gap-3">
                <TrophyOutlined className="text-2xl text-yellow-600" />
                <div>
                  <div className="text-sm text-gray-600 font-medium">Most Borrowed</div>
                  <div className="text-xl font-bold text-yellow-700">
                    {dashboardData.mostBorrowed.name}
                  </div>
                  <div className="text-sm text-yellow-600">
                    {dashboardData.mostBorrowed.totalBorrowed} times borrowed
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <div className="flex items-center gap-2">
                  <ClockCircleOutlined className="text-blue-500" />
                  <span>Recent Activity</span>
                </div>
              }
              className="h-full"
            >
              <List
                dataSource={recentActivity}
                renderItem={(item) => (
                  <List.Item className="hover:bg-gray-50 px-2 rounded">
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          size="small"
                          style={{
                            backgroundColor: item.status === 'pending' ? '#faad14' : '#52c41a'
                          }}
                        >
                          {item.user.charAt(0)}
                        </Avatar>
                      }
                      title={
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.action}</span>
                          <Tag
                            color={item.status === 'pending' ? 'orange' : 'green'}
                          
                          >
                            {item.status}
                          </Tag>
                        </div>
                      }
                      description={
                        <div className="text-xs text-gray-600">
                          <div>{item.user} - {item.item}</div>
                          <div className="text-gray-500">{item.time}</div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              title={
                <div className="flex items-center gap-2">
                  <InboxOutlined className="text-red-500" />
                  <span>Low Stock Alert</span>
                  <Tag color="red">
                    {lowStockItems.length} items
                  </Tag>
                </div>
              }
              className="h-full"
            >
              <List
                dataSource={lowStockItems}
                renderItem={(item) => (
                  <List.Item className="hover:bg-gray-50 px-2 rounded">
                    <List.Item.Meta
                      avatar={
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <InboxOutlined className="text-red-500 text-sm" />
                        </div>
                      }
                      title={
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.name}</span>
                          <Tag color="red">
                            {item.stock} {item.unit}
                          </Tag>
                        </div>
                      }
                      description={
                        <div className="flex items-center gap-2">
                          <Progress
                            percent={(item.stock / 50) * 100}
                            size="small"
                            status="exception"
                            showInfo={false}
                            className="flex-1"
                          />
                          <span className="text-xs text-red-500">Low stock</span>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        <Card
          title={
            <div className="flex items-center gap-2">
              <AppstoreOutlined className="text-blue-500" />
              <span>Quick Actions</span>
            </div>
          }
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
                <InboxOutlined className="text-2xl text-blue-500 mb-2" />
                <div className="font-medium">Add Inventory</div>
                <div className="text-xs text-gray-500">Add new items</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-sm transition-all cursor-pointer">
                <SwapOutlined className="text-2xl text-green-500 mb-2" />
                <div className="font-medium">New Borrowing</div>
                <div className="text-xs text-gray-500">Create request</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer">
                <EnvironmentOutlined className="text-2xl text-purple-500 mb-2" />
                <div className="font-medium">Add Location</div>
                <div className="text-xs text-gray-500">New storage</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all cursor-pointer">
                <ShopOutlined className="text-2xl text-orange-500 mb-2" />
                <div className="font-medium">Add Supplier</div>
                <div className="text-xs text-gray-500">New supplier</div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </Base>
  )
}