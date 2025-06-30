import { Button, DatePicker, Flex, Form, Input, Select, Typography } from "antd";
import type { FormProps } from "antd";

const { Title } = Typography;
type FieldType = {
    mst: string,
    fullname: string,
    gender: boolean,
    birthday: Date,
    cccd: string,
    cccdDate: Date,
    cccdAt: string,
    phone: string,
    address: string,
    work: string,
    workPlace: string
}
const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log(values);
};

export function ImportPage(){
    return (
        <Flex vertical flex={1}>
            <Title>Nhập nhân viên</Title>
            <Form
                labelCol={{ span: 5 }}
                style={{ maxWidth: 600 }}
                autoComplete="off"
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
                        <Select.Option value={true}>Nam</Select.Option>
                        <Select.Option value={false}>Nữ</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item<FieldType>
                    label="Ngày sinh"
                    name="birthday"
                    rules={[{ required: true, message: "Cần nhập trường này" }]}
                >
                    <DatePicker />
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
                    <DatePicker />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Tại"
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
                    <Button type="primary" htmlType="submit">
                        Thêm nhân viên
                    </Button>
                </Form.Item>
            </Form>
        </Flex>
    );
}