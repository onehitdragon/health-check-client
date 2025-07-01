import { UploadOutlined } from "@ant-design/icons";
import { Button, Flex, message, Table, Tooltip, Typography, Upload, type TableColumnsType, type TableProps, type UploadProps } from "antd";
import type { RcFile } from "antd/es/upload/interface";
import { useState } from "react";
import * as xlsx from "xlsx";
import api from "../api";

const { Title } = Typography;
type DataType = {
    key: React.Key
    mst: string,
    fullname: string,
    gender: string,
    birthday: string,
    cccd: string,
    cccdDate: string,
    cccdAt: string,
    phone: string,
    address: string,
    work: string,
    workPlace: string
}
type DataTypeValidation = DataType & {
    errors: { [key in keyof DataType]?: string }
}
const render = (test: any, value: any) => {
    return (
        test ?
        <Tooltip title={test}>
            <span style={{ color: "red" }}>{value ? value : "Trống"}</span>
        </Tooltip>
        :
        <span>{value}</span>
    );
};
const columns: TableColumnsType<DataTypeValidation> = [
    {
        title: "MST",
        dataIndex: "mst",
        render: (value, record) => {
            return render(record.errors.mst, value);
        }
    },
    {
        title: "Họ tên",
        dataIndex: "fullname",
        render: (value, record) => {
            return render(record.errors.fullname, value);
        }
    },
    {
        title: "Giới tính",
        dataIndex: "gender",
        render: (value, record) => {
            return render(record.errors.gender, value);
        }
    },
    {
        title: "Ngày sinh",
        dataIndex: "birthday",
        render: (value, record) => {
            return render(record.errors.birthday, value);
        }
    },
    {
        title: "CCCD/CMND",
        dataIndex: "cccd",
        render: (value, record) => {
            return render(record.errors.cccd, value);
        }
    },
    {
        title: "Ngày cấp",
        dataIndex: "cccdDate",
        render: (value, record) => {
            return render(record.errors.cccdDate, value);
        }
    },
    {
        title: "Cấp tại",
        dataIndex: "cccdAt",
        render: (value, record) => {
            return render(record.errors.cccdAt, value);
        }
    },
    {
        title: "Điện thoại",
        dataIndex: "phone",
        render: (value, record) => {
            return render(record.errors.phone, value);
        }
    },
    {
        title: "Địa chỉ",
        dataIndex: "address",
        render: (value, record) => {
            return render(record.errors.address, value);
        }
    },
    {
        title: "Công việc",
        dataIndex: "work",
        render: (value, record) => {
            return render(record.errors.work, value);
        }
    },
    {
        title: "Nơi công tác",
        dataIndex: "workPlace",
        render: (value, record) => {
            return render(record.errors.workPlace, value);
        }
    }
];
let datas: DataTypeValidation[] = [];

export function ExcelImportPage(){
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedFile, setSelectedFile] = useState<RcFile | null>(null);
    const [importing, setImporting] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const beforeUpload: UploadProps["beforeUpload"] = (file) => {
        const allowExts = [".xlsx", ".xls"]
        const ext = file.name.slice(file.name.lastIndexOf("."), file.name.length).toLowerCase();
        if(!allowExts.includes(ext)){
            messageApi.error("File không đúng định dạng");
            return Upload.LIST_IGNORE;
        }
        setSelectedFile(file);
        return false;
    };
    const onRemove: UploadProps["onRemove"] = () => {
        setSelectedFile(null);
    };
    const startImport = async () => {
        setImporting(true);
        const fileData = await selectedFile!.arrayBuffer();
        const book = xlsx.read(fileData);
        const sheet = book.Sheets[book.SheetNames[0]];
        const jsonObj = xlsx.utils.sheet_to_json(
            sheet, 
            { 
                header: ["mst","fullname","gender","birthday","cccd","cccdDate","cccdAt","phone","address","work","workPlace"]
            }
        );
        jsonObj.shift(); // remove header
        const mstSet = new Set<string>();
        const cccdSet = new Set<string>();
        const phoneSet = new Set<string>();
        for(let i = 0; i < jsonObj.length; i++){
            const employee = jsonObj[i] as DataTypeValidation;
            employee.key = i;
            employee.errors = {};
            if(!employee.mst){
                employee.errors.mst = "Yêu cầu trường này";
            }
            else{
                const res = await api.get(`/employee/existedmst?mst=${employee.mst}`);
                if(res.data.existed){
                    employee.errors.mst = "MST đã tồn tại";
                }
            }
            if(!employee.fullname){
                employee.errors.fullname = "Yêu cầu trường này";
            }
            if(!employee.gender){
                employee.errors.gender = "Yêu cầu trường này";
            }
            if(!employee.birthday){
                employee.errors.birthday = "Yêu cầu trường này";
            }
            if(!employee.cccd){
                employee.errors.cccd = "Yêu cầu trường này";
            }
            else if(!(/^\d{9}$|^\d{12}$/.test(employee.cccd))){
                employee.errors.cccd = "Yêu cầu 9 hoặc 12 chữ số";
            }
            else{
                const res = await api.get(`/employee/existedcccd?cccd=${employee.cccd}`);
                if(res.data.existed){
                    employee.errors.cccd = "CCCD/CMND đã tồn tại";
                }
            }
            if(!employee.cccdDate){
                employee.errors.cccdDate = "Yêu cầu trường này";
            }
            if(!employee.cccdAt){
                employee.errors.cccdAt = "Yêu cầu trường này";
            }
            if(!employee.phone){
                employee.errors.phone = "Yêu cầu trường này";
            }
            else if(!(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(employee.phone))){
                employee.errors.phone = "Không hợp lệ";
            }
            else{
                const res = await api.get(`/employee/existedphone?phone=${employee.phone}`);
                if(res.data.existed){
                    employee.errors.phone = "Số điện thoại đã tồn tại";
                }
            }
            if(!employee.address){
                employee.errors.address = "Yêu cầu trường này";
            }
            if(!employee.work){
                employee.errors.work = "Yêu cầu trường này";
            }
            if(!employee.workPlace){
                employee.errors.workPlace = "Yêu cầu trường này";
            }
            if(Object.keys(employee.errors).length <= 0){
                if(mstSet.has(employee.mst)){
                    employee.errors.mst = "MST đã tồn tại trước đó";
                }
                if(cccdSet.has(employee.cccd)){
                    employee.errors.cccd = "CCCD/CMND đã tồn tại trước đó";
                }
                if(phoneSet.has(employee.phone)){
                    employee.errors.phone = "Số điện thoại đã tồn tại trước đó";
                }
                mstSet.add(employee.mst);
                cccdSet.add(employee.cccd);
                phoneSet.add(employee.phone);
            }
        }
        datas = jsonObj as any;
        setSelectedRowKeys([]);
        setImporting(false);
        console.log(jsonObj);
    };
    const rowSelection: TableProps<DataTypeValidation>['rowSelection'] = {
        type: "checkbox",
        selectedRowKeys: selectedRowKeys,
        getCheckboxProps: (record) => {
            return {
                disabled: Object.keys(record.errors).length > 0
            };
        },
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
        }
    }
    const addSelectedEmployees = async () => {
        setImporting(true);
        const toAddEmployees = [];
        const genderStringToNumber = (gender: string) => {
            gender = gender.toLowerCase();
            if(gender === "nam") return 1;
            return 0;
        };
        for(let i = 0; i < selectedRowKeys.length; i++){
            const key = selectedRowKeys[i];
            for(let j = 0; j < datas.length; j++){
                const data = datas[j];
                if(data.key === key){
                    const ee: any = {
                        ...data,
                        cccd: data.cccd.toString(),
                        phone: data.phone.toString(),
                        gender: genderStringToNumber(data.gender)
                    };
                    delete ee.key;
                    delete ee.errors;
                    toAddEmployees.push(ee);
                    break;
                }
            }
        }
        const res = await api.post("/employee/addall", toAddEmployees);
        console.log(res);
        datas = [];
        setSelectedRowKeys([]);
        setImporting(false);
        messageApi.info(`Đã thêm ${toAddEmployees.length} nhân viên`);
    };

    return (
        <>
        {contextHolder}
        <Flex vertical flex={1} gap="small">
            <Title>Nhập nhân viên từ excel</Title>
            <Upload
                beforeUpload={beforeUpload}
                onRemove={onRemove}
                maxCount={1}
                accept=".xlsx,.xls"
            >
                <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
            <Flex>
                <Button
                    type="primary"
                    disabled={!selectedFile}
                    onClick={startImport}
                    loading={importing}
                >
                    Bắt đầu nhập
                </Button>
            </Flex>
            <Table
                rowKey="key"
                rowSelection={rowSelection}
                columns={columns}
                dataSource={datas}
            ></Table>
            <Flex>
                {
                    selectedRowKeys.length > 0
                    &&
                    <Button
                        type="primary"
                        onClick={addSelectedEmployees}
                        loading={importing}
                    >
                        Thêm {selectedRowKeys.length} nhân viên
                    </Button>
                }
            </Flex>
        </Flex>
        </>
    );
}