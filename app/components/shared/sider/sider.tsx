import React, { useState } from 'react';
import { Flex, Layout, Menu, Modal } from 'antd';
import { useNavigate, useLocation } from 'react-router';
import type { MenuProps } from 'antd';
// import menuDummy from '~/mocks/menu.json';
import { getIconComponent } from './menu-config';
import type { MenuItem } from '~/types/global.types';
import { useAppDispatch, useAppSelector } from '~/stores/hook';
import './style.scss'
import { IconAlignRight2, IconSquareRoundedArrowLeftFilled } from '@tabler/icons-react';
import { logout } from '~/stores/main/auth/auth.slice';

interface ISider {
  onToggle: () => void
}

export default function Sider(props: ISider) {
  const globalState = useAppSelector((state) => state.global)
  const authState = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);


  const processMenuItems = (items: MenuItem[]): any[] => {
    return items.map((item: MenuItem) => {
      if (item.children && item.children.length > 0) {
        return {
          key: item.key,
          icon: getIconComponent(item.icon),
          label: item.label,
          children: processMenuItems(item.children),
        };
      }
      return {
        key: item.key,
        icon: getIconComponent(item.icon),
        label: item.label,
      };
    });
  };

  const findMenuItem = (items: MenuItem[], targetKey: string): MenuItem | null => {
    for (const item of items) {
      if (item.key === targetKey) {
        return item;
      }
      if (item.children) {
        const found = findMenuItem(item.children, targetKey);
        if (found) return found;
      }
    }
    return null;
  };

  const findMatchingKeys = (items: MenuItem[], currentPath: string): string[] => {
    const matchingKeys: string[] = [];

    const searchItems = (menuItems: MenuItem[]) => {
      for (const item of menuItems) {
        if (currentPath === item.key || currentPath.startsWith(item.key + '/')) {
          matchingKeys.push(item.key);
        }
        if (item.children) {
          searchItems(item.children);
        }
      }
    };

    searchItems(items);
    return matchingKeys;
  };

  const getCurrentKey = (): string => {
    const currentPath = location.pathname;
    const matchingKeys = findMatchingKeys((authState.userData?.menus ?? []), currentPath);

    const mostSpecificKey = matchingKeys.reduce((longest, current) => {
      return current.length > longest.length ? current : longest;
    }, matchingKeys[0] || '/');

    return mostSpecificKey;
  };

  const getOpenKeys = (): string[] => {
    const currentPath = location.pathname;
    const openKeys: string[] = [];

    const findParentKeys = (items: MenuItem[], path: string) => {
      for (const item of items) {
        if (item.children) {
          const hasMatchingChild = item.children.some(child =>
            path === child.key || path.startsWith(child.key + '/')
          );
          if (hasMatchingChild) {
            openKeys.push(item.key);
          }
          findParentKeys(item.children, path);
        }
      }
    };

    findParentKeys((authState.userData?.menus ?? []), currentPath);
    return openKeys;
  };

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    const selectedItem = findMenuItem((authState.userData?.menus ?? []), key);
    if (selectedItem) {
      navigate(selectedItem.key);
    }
  };

  const showLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    dispatch(logout());
    navigate('/login');
    setIsLogoutModalOpen(false);
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <div className={`${globalState.siderCollapsed ? 'w-fit' : 'w-[260px]'} bg-[#f6f6f6] border-r border-[#d2d2cf] flex flex-col justify-between h-screen fixed z-50 overflow-auto left-0 top-0 bottom-0`}>
      <div>
        <Flex align='center' justify={globalState.siderCollapsed ? 'center' : 'space-between'} className='relative w-full h-16  !px-4'>
          {
            !globalState.siderCollapsed && <h2 className='font-semibold'>Web Inventory</h2>
          }
          <span
            className='block cursor-pointer border border-[#d2d2cf] p-2 rounded-full'
            onClick={props.onToggle}
          >
            <IconAlignRight2 className='w-4 h-4' />
          </span>
        </Flex>
        <Menu
          className='font-medium !bg-transparent'
          selectedKeys={[getCurrentKey()]}
          defaultOpenKeys={getOpenKeys()}
          mode="inline"
          onClick={handleMenuClick}
          inlineCollapsed={globalState.siderCollapsed}
          items={processMenuItems((authState.userData?.menus ?? []))}
        />
      </div>
      <Flex align='center' justify={globalState.siderCollapsed ? 'center' : 'end'} className='!p-4'>
        <IconSquareRoundedArrowLeftFilled className='w-8 h-8 cursor-pointer text-[#d55559]' onClick={showLogoutModal} />
      </Flex>
      <Modal
        title="Confirm Logout"
        open={isLogoutModalOpen}
        onOk={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        okText="Yes, I'm Sure"
        cancelText="Cancel"
        okType="danger"
        centered
        width={400}
      >
        <div className="py-4">
          <p className="text-gray-600">
            Are you sure you want to log out of the app? You will be redirected to the login page.
          </p>
        </div>
      </Modal>
    </div>
  );
}