import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumb, Col, Form, Row, Select, Button, Input, message } from "antd";
import { GetTableInfo } from "../../services/table-services";

export interface tableInfo {
    tableId: string;
    tableName: string;
}

const ArrangeBookPage = () => {
    const { BookingId } = useParams<{ BookingId: string }>();
    const [tableId, setTableId] = useState('');
    const [tableTypeName, setTableTypeName] = useState('');
    const [tableInfo, setTableInfo] = useState<tableInfo[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await GetTableInfo();
                if (result) {
                    setTableInfo(result.value);
                }
            } catch (error) {
                console.error("Error fetching table info:", error);
            }
        };

        fetchData();
    }, []);

    const handleSelectChange = (value: string) => {
        const selectedTable = tableInfo.find(table => table.tableId === value);
        setTableId(value);
        setTableTypeName(selectedTable ? selectedTable.tableName : '');
    };

    const handleSubmit = async (values: any) => {
        const data = {
            tableId: values.tableId,
            tableTypeName: tableTypeName
        };
        console.log('Data to be sent:', data);

        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            const response = await fetch(`https://localhost:7057/api/booking/table-arrange/${BookingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.text();
                try {
                    const errorJson = errorData ? JSON.parse(errorData) : {};
                    console.error('HTTP error! status:', response.status, 'Error data:', errorJson);
                } catch (err) {
                    console.error('Failed to parse error response:', err);
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            message.success('Xếp bàn thành công');
            console.log('Success:', await response.json());
        } catch (error) {
            message.error('Xếp bàn thất bại. Vui lòng thử lại sau');
            console.error('Error:', error);
        }
    };

    return (
        <Form onFinish={handleSubmit}>
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={24}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to="/">Dashboard</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to="/bookings">Booking</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Arrange</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Row gutter={16} className="mt-3">
                <Col xs={24} sm={12} md={9}>
                    <Form.Item label="Booking Id" name="BookingId" initialValue={BookingId}>
                        <Input value={BookingId} readOnly />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={9}>
                    <Form.Item label="Select Table" name="tableId" initialValue={tableId} rules={[{ required: true, message: 'Please select a table' }]}>
                        <Select value={tableId} onChange={handleSelectChange}>
                            <Select.Option value="">Select Table</Select.Option>
                            {tableInfo.map((table) => (
                                <Select.Option key={table.tableId} value={table.tableId}>
                                    {table.tableName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} className="text-right">
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default ArrangeBookPage;
