import { Flex, Menu } from "antd";
import type { MenuProps } from 'antd';
import { PlusOutlined, AppstoreOutlined, PrinterOutlined } from '@ant-design/icons';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ImportPage } from './pages/ImportPage';
import { ExcelImportPage } from './pages/ExcelImportPage';
import { PrintPage } from './pages/PrintPage';
import ControlPage from './pages/ControlPage';

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
    key: '/print',
    icon: <PrinterOutlined />,
    label: "In giấy khám"
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
    if(e.key === "/excelimport"){
      navigate("/excelimport");
    }
    if(e.key === "/print"){
      navigate("/print");
    }
    if(e.key === "/control"){
      navigate("/control");
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
        <Route path='/excelimport' element={<ExcelImportPage />} />
        <Route path='/print' element={<PrintPage />} />
        <Route path='/control' element={<ControlPage />} />
      </Routes>
    </Flex>
  )
}

export default App
