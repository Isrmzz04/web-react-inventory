import {
  AppstoreOutlined,
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
import { useNavigate } from "react-router";
import Base from "~/components/shared/base/base";
import { useAppDispatch, useAppSelector } from "~/stores/hook";
import { getDashboard } from "~/stores/main/dashboard/dashboard.slice";

export default function Dashboard() {
  const dashboardState = useAppSelector((state) => state.dashboard)
  const dispatch = useAppDispatch()


  useEffect(() => {
    dispatch(getDashboard())
  }, [])

  const navigate = useNavigate();

  const quickActionItems = [
    {
      icon: <InboxOutlined className="text-2xl text-blue-500 mb-2" />,
      title: "Tambah Inventaris",
      description: "Tambah item baru",
      route: "/inventory-management/inventories",
      hoverColor: "hover:border-blue-300"
    },
    {
      icon: <SwapOutlined className="text-2xl text-green-500 mb-2" />,
      title: "Peminjaman Baru",
      description: "Buat permintaan",
      route: "/borrowing-request",
      hoverColor: "hover:border-green-300"
    },
    {
      icon: <EnvironmentOutlined className="text-2xl text-purple-500 mb-2" />,
      title: "Tambah Lokasi",
      description: "Penyimpanan baru",
      route: "/inventory-management/locations",
      hoverColor: "hover:border-purple-300"
    },
    {
      icon: <ShopOutlined className="text-2xl text-orange-500 mb-2" />,
      title: "Tambah Supplier",
      description: "Supplier baru",
      route: "/inventory-management/suppliers",
      hoverColor: "hover:border-orange-300"
    }
  ];

  const handleQuickAction = (route: string) => {
    navigate(route);
  };

  return (
    <Base>
      <Spin spinning={dashboardState.isLoading}>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Selamat datang kembali! Anda sedang berada pada admin panel Sistem Inventaris
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Terakhir diperbarui: {dayjs().format('DD/MM/YYYY HH:mm')}
              </div>
            </div>
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card className="hover:shadow-md transition-shadow">
                <Statistic
                  title="Total Inventaris"
                  value={dashboardState?.datas?.statistic?.totalInventories}
                  prefix={<InboxOutlined className="text-blue-500" />}
                  valueStyle={{ color: '#1890ff' }}
                />
                <div className="mt-2 text-xs text-gray-500">
                  Semua Item
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="hover:shadow-md transition-shadow">
                <Statistic
                  title="Total Kategori"
                  value={dashboardState?.datas?.statistic?.totalCategories}
                  prefix={<AppstoreOutlined className="text-green-500" />}
                  valueStyle={{ color: '#52c41a' }}
                />
                <div className="mt-2 text-xs text-gray-500">
                  Kategori aktif
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="hover:shadow-md transition-shadow">
                <Statistic
                  title="Total Lokasi"
                  value={dashboardState?.datas?.statistic?.totalLocations}
                  prefix={<EnvironmentOutlined className="text-purple-500" />}
                  valueStyle={{ color: '#722ed1' }}
                />
                <div className="mt-2 text-xs text-gray-500">
                  Lokasi penyimpanan
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="hover:shadow-md transition-shadow">
                <Statistic
                  title="Total Supplier"
                  value={dashboardState?.datas?.statistic?.totalSuppliers}
                  prefix={<ShopOutlined className="text-orange-500" />}
                  valueStyle={{ color: '#fa8c16' }}
                />
                <div className="mt-2 text-xs text-gray-500">
                  Supplier aktif
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card className="hover:shadow-md transition-shadow">
                <Statistic
                  title="Total Peminjaman"
                  value={dashboardState?.datas?.statistic?.totalBorrowings}
                  prefix={<SwapOutlined className="text-cyan-500" />}
                  valueStyle={{ color: '#13c2c2' }}
                />
                <div className="mt-2 text-xs text-gray-500">
                  Semua peminjaman
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="hover:shadow-md transition-shadow">
                <Statistic
                  title="Menunggu Persetujuan"
                  value={dashboardState?.datas?.statistic?.pendingApprovals}
                  prefix={<ClockCircleOutlined className="text-yellow-500" />}
                  valueStyle={{ color: '#faad14' }}
                />
                <div className="mt-2 text-xs text-gray-500">
                  Memerlukan perhatian
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="hover:shadow-md transition-shadow">
                <Statistic
                  title="Peminjaman Hari Ini"
                  value={dashboardState?.datas?.statistic?.borrowingToday}
                  prefix={<CalendarOutlined className="text-red-500" />}
                  valueStyle={{ color: '#f5222d' }}
                />
                <div className="mt-2 text-xs text-gray-500">
                  Permintaan baru hari ini
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="hover:shadow-md transition-shadow bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
                <div className="flex items-center gap-3">
                  <TrophyOutlined className="text-2xl text-yellow-600" />
                  <div>
                    <div className="text-sm text-gray-600 font-medium">Paling Banyak Dipinjam</div>
                    <div className="text-xl font-bold text-yellow-700">
                      {dashboardState?.datas?.statistic?.mostBorrowed.name}
                    </div>
                    <div className="text-sm text-yellow-600">
                      {dashboardState?.datas?.statistic?.mostBorrowed.totalBorrowed} kali dipinjam
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
                    <span>QR Code Form Permintaan Peminjaman</span>
                  </div>
                }
                className="h-full"
              >
                {/* QR CODE */}
                <QRCode value={'https://sistem-inventaris.my.id/borrowing-request'} />
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                title={
                  <div className="flex items-center gap-2">
                    <InboxOutlined className="text-red-500" />
                    <span>Peringatan Stok Rendah</span>
                    <Tag color="red">
                      {dashboardState?.datas?.lowStockItems?.length} item
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
                            <span className="text-xs text-red-500">Stok rendah</span>
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
                <span>Aksi Cepat</span>
              </div>
            }
          >
            <Row gutter={[16, 16]}>
              {quickActionItems.map((item, index) => (
                <Col xs={24} sm={12} md={6} key={index}>
                  <div
                    className={`text-center p-4 border border-gray-200 rounded-lg ${item.hoverColor} hover:shadow-sm transition-all cursor-pointer`}
                    onClick={() => handleQuickAction(item.route)}
                  >
                    {item.icon}
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </div>
      </Spin>
    </Base>
  )
}