import { useState } from 'react'
import { Flex, Menu } from "antd";
import type { MenuProps } from 'antd';
import { PlusOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ImportPage } from './pages/ImportPage';

type MenuItem = Required<MenuProps>['items'][number];
const items: MenuItem[] = [
  {
    key: '1',
    icon: <PlusOutlined />,
    label: "Thêm nhân viên",
    children: [
      {
        key: '/normalimport',
        label: "Nhập nhân viên"
      },
      {
        key: '/excelimport',
        label: "Nhập nhân viên từ excel"
      }
    ]
  },
  {
    key: '/control',
    icon: <AppstoreOutlined />,
    label: "Quản lý nhân viên"
  }
]

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItemOnClick: MenuProps["onClick"] = (e) => {
    if(e.key === "/normalimport"){
      navigate("/normalimport");
    }
  };

  return (
    <Flex gap={20}>
      <Menu
        style={{width: 256}}
        items={items}
        onClick={menuItemOnClick}
        defaultSelectedKeys={[location.pathname]}
      />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/normalimport' element={<ImportPage />} />
      </Routes>
    </Flex>
  )
}

export default App
