import { Button, Checkbox, Flex, Input, message, Popconfirm, Table, Typography, type CheckboxOptionType, type TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import api from "../api";

const { Title } = Typography;
const { Search } = Input;
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
        key: 1,
        title: "MST",
        dataIndex: "mst",
    },
    {
        key: 2,
        title: "Họ tên",
        dataIndex: "fullname",
        sorter: (a, b) => {
            const l1 = a.fullname.split(" ").at(-1);
            const l2 = b.fullname.split(" ").at(-1);
            if(l1 && l2){
                return l1.charCodeAt(0) - l2[0].charCodeAt(0);
            }
            return 0;
        },
        sortDirections: ['ascend']
    },
    {
        key: 3,
        title: "Giới tính",
        dataIndex: "gender",
        render: (_, record) => {
            return record.gender == 1 ? "Nam" : "Nữ"   
        },
        filters: [
            {
                text: "Nam",
                value: 1
            },
            {
                text: "Nữ",
                value: 0
            }
        ],
        onFilter: (value, record) => {
            return record.gender == value;
        }
    },
    {
        key: 4,
        title: "Ngày sinh",
        dataIndex: "birthday"
    },
    {
        key: 5,
        title: "CCCD/CMND",
        dataIndex: "cccd"
    },
    {
        key: 6,
        title: "Ngày cấp",
        dataIndex: "cccdDate"
    },
    {
        key: 7,
        title: "Cấp tại",
        dataIndex: "cccdAt"
    },
    {
        key: 8,
        title: "Điện thoại",
        dataIndex: "phone"
    },
    {
        key: 9,
        title: "Địa chỉ",
        dataIndex: "address"
    },
    {
        key: 10,
        title: "Công việc",
        dataIndex: "work"
    },
    {
        key: 11,
        title: "Nơi công tác",
        dataIndex: "workPlace"
    },
    {
        key: 12,
        title: "Thao tác"
    }
];
const defaultCheckedList = columns.map((item) => item.key);
type ExpandedDataType = {
    id: number,
    print_at: string,
    employee_mst: string
}
const expandColumns: TableColumnsType<ExpandedDataType> = [
    {
        title: "In lúc",
        dataIndex: "print_at",
        render: (_, record) => {
            const isoDate = new Date(record.print_at.replace(" ", "T") + "Z");
            return <span>{isoDate.toLocaleString()}</span>
        }
    }
];

export default function ControlPage(){
    const [_, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(true);
    const [datas, setDatas] = useState<DataType[]>([]);
    const [checkedList, setCheckedList] = useState(defaultCheckedList);
    const [printHistories, setPrintHistories] = useState<ExpandedDataType[]>([]);
    const [searchText, setSearchText] = useState("");
    
    const options = columns.map(({ key, title }) => ({
        label: title,
        value: key,
    }));
    const deleteHandle = async (record: DataType) => {
        setLoading(true);
        const res = await api.delete(`/employee?mst=${record.mst}`);
        console.log(res);
        setPrintHistories(printHistories.filter((ph) => {
            return ph.employee_mst != record.mst;
        }));
        setDatas(datas.filter((ee) => {
            return ee.mst != record.mst;
        }));
        setLoading(false);
    };
    const newColumns = columns.map((col, index) => {
        if(index == columns.length - 1){
            return {
                ...col,
                hidden: !checkedList.includes(col.key),
                render: (_, record) => {
                    return (
                        <Flex>
                            <Popconfirm
                                title="Xóa nhân viên này?"
                                okText="Đồng ý"
                                cancelText="Hủy"
                                onConfirm={() => { deleteHandle(record); }}
                                >
                                <Button danger type="primary">
                                    Xóa
                                </Button>
                            </Popconfirm>
                        </Flex>
                    );
                }
            } as typeof col;
        }
        return {
            ...col,
            hidden: !checkedList.includes(col.key)
        };
    });
    useEffect(() => {
        api.get("/employee/getall")
        .then((res) => {
            setDatas(res.data.employees);
            api.get("/employee/printhistory")
            .then((res) => {
                setPrintHistories(res.data.printHistories);
                setLoading(false);
            });
        });
    }, []);
    const expandedRowRender = (record: DataType) => {
        return (
            <Table<ExpandedDataType>
                rowKey={(record) => record.id}
                columns={expandColumns}
                dataSource={printHistories.filter(ph => ph.employee_mst == record.mst)}
                pagination={false}
                locale={{ emptyText: 'Chưa được in' }}
            />
        );
    };
    const onSearch = (value: string) => {
        setSearchText(value);
    };

    return (
        <>
        {contextHolder}
        <Flex vertical flex={1} gap={10}>
            <Title>Quản lý nhân viên</Title>
            <Checkbox.Group
                value={checkedList}
                options={options as CheckboxOptionType[]}
                onChange={(value) => {
                    setCheckedList(value);
                }}
            />
            <Search 
                placeholder="Tìm kiếm"
                onSearch={(onSearch)}
                enterButton
                style={{ width: 300 }}
            />
            <Table<DataType>
                rowKey={(record) => record.mst}
                loading={loading}
                columns={newColumns}
                dataSource={datas.filter((ee) => {
                    if(ee.mst.includes(searchText)){
                        return true;
                    }
                    if(ee.fullname.includes(searchText)){
                        return true;
                    }
                    if(ee.cccd.includes(searchText)){
                        return true;
                    }
                    if(ee.phone.includes(searchText)){
                        return true;
                    }
                    return false;
                })}
                expandable={{ expandedRowRender }}
            />
        </Flex>
        </>
    );
}