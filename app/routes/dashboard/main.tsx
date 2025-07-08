import {
  AppstoreOutlined,
  ArrowUpOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  InboxOutlined,
  ShopOutlined,
  SwapOutlined,
  TrophyOutlined
} from "@ant-design/icons";
import { Card, Col, List, Progress, QRCode, Row, Spin, Statistic, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import Base from "~/components/shared/base/base";
import { useAppDispatch, useAppSelector } from "~/stores/hook";
import { getDashboard } from "~/stores/main/dashboard/dashboard.slice";

export default function Dashboard() {
  const dashboardState = useAppSelector((state) => state.dashboard)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getDashboard())
  }, [])

  return (
    <Base>
      <Spin spinning={dashboardState.isLoading}>
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
                  value={dashboardState?.datas?.statistic?.totalInventories}
                  prefix={<InboxOutlined className="text-blue-500" />}
                  valueStyle={{ color: '#1890ff' }}
                />
                <div className="mt-2 text-xs text-gray-500">
                 All Item
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="hover:shadow-md transition-shadow">
                <Statistic
                  title="Total Categories"
                  value={dashboardState?.datas?.statistic?.totalCategories}
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
                  value={dashboardState?.datas?.statistic?.totalLocations}
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
                  value={dashboardState?.datas?.statistic?.totalSuppliers}
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
                  value={dashboardState?.datas?.statistic?.totalBorrowings}
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
                  value={dashboardState?.datas?.statistic?.pendingApprovals}
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
                  value={dashboardState?.datas?.statistic?.borrowingToday}
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
                      {dashboardState?.datas?.statistic?.mostBorrowed.name}
                    </div>
                    <div className="text-sm text-yellow-600">
                      {dashboardState?.datas?.statistic?.mostBorrowed.totalBorrowed} times borrowed
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
                    <span>Borrowing Request Form QR Code</span>
                  </div>
                }
                className="h-full"
              >
                {/* QR CODE */}
                <QRCode value={'https://sistem-inventaris.my.id/be/borrowing-request'} />
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                title={
                  <div className="flex items-center gap-2">
                    <InboxOutlined className="text-red-500" />
                    <span>Low Stock Alert</span>
                    <Tag color="red">
                      {dashboardState?.datas?.lowStockItems?.length} items
                    </Tag>
                  </div>
                }
                className="h-full"
              >
                <List
                  dataSource={dashboardState?.datas?.lowStockItems}
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
      </Spin>
    </Base>
  )
}