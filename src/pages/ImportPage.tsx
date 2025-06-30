import { Button, DatePicker, Flex, Form, Input, message, Select, Typography } from "antd";
import type { FormProps } from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import api from "../api";
import axios from "axios";

const { Title } = Typography;
type FieldType = {
    mst: string,
    fullname: string,
    gender: number,
    birthday: Dayjs,
    cccd: string,
    cccdDate: Dayjs,
    cccdAt: string,
    phone: string,
    address: string,
    work: string,
    workPlace: string
}

export function ImportPage(){
    const [form] = useForm();
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        const employee = {
            ...values,
            birthday: values.birthday.format("YYYY-MM-DD"),
            cccdDate: values.cccdDate.format("YYYY-MM-DD")
        };
        setLoading(true);
        try{
            const res = await api.post("/employee/add", employee);
            messageApi.info(`Đã thêm: ${employee.fullname}`);
        }
        catch(err){
            if(axios.isAxiosError(err) && err.status == 400){
                if("mstErr" in err.response?.data){
                    form.setFields([{name: "mst", errors: ["Mã nhân viên đã tồn tại"]}]);
                }
                if("cccdErr" in err.response?.data){
                    form.setFields([{name: "cccd", errors: ["CCCD/CMND đã tồn tại"]}]);
                }
                if("phoneErr" in err.response?.data){
                    form.setFields([{name: "phone", errors: ["Số điện thoại đã tồn tại"]}]);
                }
                messageApi.error("Cần kiểm tra lại thông tin");
            }
        }
        setLoading(false);
    };

    return (
        <>
        {contextHolder}
        <Flex vertical flex={1}>
            <Title>Nhập nhân viên</Title>
            <Form
                labelCol={{ span: 5 }}
                style={{ maxWidth: 600 }}
                autoComplete="off"
                form={form}
                onFinish={onFinish}
            >
                <Form.Item<FieldType>
                    label="Mã số thẻ:"
                    name="mst"
                    rules={[{ required: true, message: "Cần nhập trường này" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Tên nhân viên"
                    name="fullname"
                    rules={[{ required: true, message: "Cần nhập trường này" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Giới tính"
                    name="gender"
                    rules={[{ required: true, message: "Cần nhập trường này" }]}
                >
                    <Select
                        placeholder="Chọn giới tính"
                    >
                        <Select.Option value={1}>Nam</Select.Option>
                        <Select.Option value={0}>Nữ</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item<FieldType>
                    label="Ngày sinh"
                    name="birthday"
                    rules={[{ required: true, message: "Cần nhập trường này" }]}
                >
                    <DatePicker maxDate={dayjs()}/>
                </Form.Item>
                <Form.Item<FieldType>
                    label="CMND/CCCD"
                    name="cccd"
                    rules={[
                        { required: true, message: "Cần nhập trường này" },
                        { pattern: /^\d{9}$|^\d{12}$/, message: "Yêu cầu 9 hoặc 12 chữ số" }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Ngày cấp"
                    name="cccdDate"
                    rules={[{ required: true, message: "Cần nhập trường này" }]}
                >
                    <DatePicker maxDate={dayjs()}/>
                </Form.Item>
                <Form.Item<FieldType>
                    label="Cấp tại"
                    name="cccdAt"
                    rules={[{ required: true, message: "Cần nhập trường này" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                        { required: true, message: "Cần nhập trường này" },
                        { pattern: /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, message: "Không hợp lệ" }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Địa chỉ"
                    name="address"
                    rules={[{ required: true, message: "Cần nhập trường này" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Nghề nghiệp"
                    name="work"
                    rules={[{ required: true, message: "Cần nhập trường này" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Nơi công tác"
                    name="workPlace"
                    rules={[{ required: true, message: "Cần nhập trường này" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Thêm nhân viên
                    </Button>
                </Form.Item>
            </Form>
        </Flex>
        </>
    );
}