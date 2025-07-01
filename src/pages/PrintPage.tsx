import { Button, Flex, Form, message, Select, Table, Typography, type FormProps, type TableColumnsType, type TableProps } from "antd";
import { useEffect, useState } from "react";
import api from "../api";
import { createPDFs, createPDFType1, createPDFType2, mergePdfs, zipPdfs } from "../tools/pdfTool";

const { Title } = Typography;
type DataType = {
    mst: string,
    fullname: string,
    gender: number,
    birthday: string,
    cccd: string,
    cccdDate: string,
    cccdAt: string,
    phone: string,
    address: string,
    work: string,
    workPlace: string
}
const columns: TableColumnsType<DataType> = [
    {
        title: "MST",
        dataIndex: "mst"
    },
    {
        title: "Họ tên",
        dataIndex: "fullname"
    },
    {
        title: "Giới tính",
        dataIndex: "gender",
        render: (_, record) => {
            return record.gender == 1 ? "Nam" : "Nữ"   
        }
    },
    {
        title: "Ngày sinh",
        dataIndex: "birthday"
    },
    {
        title: "CCCD/CMND",
        dataIndex: "cccd"
    },
    {
        title: "Ngày cấp",
        dataIndex: "cccdDate"
    },
    {
        title: "Cấp tại",
        dataIndex: "cccdAt"
    },
    {
        title: "Điện thoại",
        dataIndex: "phone"
    },
    {
        title: "Địa chỉ",
        dataIndex: "address"
    },
    {
        title: "Công việc",
        dataIndex: "work"
    },
    {
        title: "Nơi công tác",
        dataIndex: "workPlace"
    }
];
const pdfSampleUrls = [
    {
        label: "SỔ KHÁM SỨC KHỎE ĐỊNH KỲ",
        url: "pdf/1.pdf"
    },
    {
        label: "KHÁM PHÁT HIỆN BỆNH NGHỀ NGHIỆP",
        url: "pdf/2.pdf"
    }
];
type FieldType = {
    printType: "SinglePDF" | "MultiplePDF",
    sampleIndex: number
}

export function PrintPage(){
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(true);
    const [datas, setDatas] = useState<DataType[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const rowSelection: TableProps<DataType>['rowSelection'] = {
        type: "checkbox",
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
        }
    }

    useEffect(() => {
        api.get("/employee/getall")
        .then((res) => {
            setDatas(res.data.employees);
            setLoading(false);
        });
    }, []);

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        setLoading(true);
        const toPdfEmployees: DataType[] = [];
        for(let i = 0; i < selectedRowKeys.length; i++){
            const key = selectedRowKeys[i];
            for(let j = 0; j < datas.length; j++){
                const data = datas[j];
                if(data.mst === key){
                    toPdfEmployees.push(data);
                    break;
                }
            }
        }
        // save
        const res = await api.post("/employee/saveprinthistory", toPdfEmployees.map(ee => ee.mst));
        console.log(res);
        // print
        let blob: Blob | null = null;
        let filename = "";
        const pdfSampleUrl = pdfSampleUrls[values.sampleIndex];
        const pdf_res = await api.get(`/${pdfSampleUrl.url}`, { responseType: "blob" });
        const pdf_data = await (pdf_res.data as Blob).arrayBuffer();
        const front_res = await api.get(`/font/Roboto-Bold.ttf`, { responseType: "blob" });
        const font_data = await (front_res.data as Blob).arrayBuffer();
        const createPDFTypes = [createPDFType1, createPDFType2];
        const sample_datas = await createPDFs(
            pdf_data, font_data, toPdfEmployees, createPDFTypes[values.sampleIndex]
        );
        if(values.printType == "SinglePDF"){
            blob = await mergePdfs(sample_datas);
            filename = `${pdfSampleUrl.label}-${toPdfEmployees.length}-nhanvien.pdf`
        }
        if(values.printType == "MultiplePDF"){
            blob = await zipPdfs(toPdfEmployees, sample_datas);
            filename = `${pdfSampleUrl.label}-${toPdfEmployees.length}-nhanvien.zip`
        }
        if(blob){
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
        setLoading(false);
    };

    return (
        <>
        {contextHolder}
        <Flex vertical flex={1}>
            <Title>In giấy khám</Title>
            <Table<DataType>
                rowKey={(record) => record.mst}
                rowSelection={rowSelection}
                loading={loading}
                columns={columns}
                dataSource={datas}
            />
            {
                selectedRowKeys.length > 0
                &&
                <Flex vertical>
                    <Title>Đã chọn ({selectedRowKeys.length})</Title>
                    <Form<FieldType>
                        labelCol={{ span: 3 }}
                        style={{ maxWidth: 600 }}
                        autoComplete="off"
                        initialValues={{
                            printType: "MultiplePDF",
                            sampleIndex: 0
                        }}
                        onFinish={onFinish}
                    >
                        <Form.Item<FieldType>
                            label="Kiểu in"
                            name="printType"
                        >
                            <Select>
                                <Select.Option value={"SinglePDF"}>Một file duy nhất (.pdf)</Select.Option>
                                <Select.Option value={"MultiplePDF"}>Từng file (.zip)</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Mẫu in"
                            name="sampleIndex"
                        >
                            <Select>
                                <Select.Option value={0}>{pdfSampleUrls[0].label}</Select.Option>
                                <Select.Option value={1}>{pdfSampleUrls[1].label}</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Bắt đầu in
                            </Button>
                        </Form.Item>
                    </Form>
                </Flex>
            }
        </Flex>
        </>
    );
}
