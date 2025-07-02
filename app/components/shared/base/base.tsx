import { ConfigProvider, Layout as MainLayout } from "antd";
import Sider from "../sider/sider";
import Providers from "./provider";
import { toggleSider } from "~/stores/global/global.slice";
import { useAppSelector, useAppDispatch } from "~/stores/hook";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const { Content } = MainLayout;
export default function Base({ children }: { children: React.ReactNode }) {
  const auth = useAppSelector((state) => state.auth)
  const globalState = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  const getLayoutMargin = () => {
    if (isMobile) {
      return 0;
    }
    return globalState.siderCollapsed ? 80 : 260;
  }

  const handleToggle = () => {
    dispatch(toggleSider());
  }

  // useEffect(() => {
  //   const token = localStorage.getItem('access_token')
  //   if (!token) {
  //     navigate('/auth/login')
  //   }
  // }, [navigate]);

  // useEffect(() => {
  //   if (!auth.token) {
  //     navigate('/auth/login')
  //   } else {
  //     navigate('/')
  //   }
  // }, [auth, navigate])

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            bodyBg: '#fafafa',
          }
        }
      }}
    >
      <MainLayout hasSider>
        <Sider onToggle={handleToggle} />
        <MainLayout>
          <Content
            style={{
              marginLeft: getLayoutMargin(),
              padding: 24,
              minHeight: '100vh',
            }}
          >
            {children}
          </Content>
        </MainLayout>
      </MainLayout>
    </ConfigProvider>

  )
}