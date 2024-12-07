import React, { useState } from "react";
import { Form, Input, Button, Alert } from "antd";
import { EmployeeResetPassword } from "../../services/account-services";

const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: { email: string }) => {
        setLoading(true);
        try {
            const response = await EmployeeResetPassword(values.email);
            setMessage('Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn.');
        } catch (error) {
            setMessage('Đã xảy ra lỗi. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{ maxWidth: 400, margin: '0 auto', padding: '40px' }}>
            <h2 style={{ textAlign: 'center' }}>Đặt lại mật khẩu</h2>
            <Form
                name="reset_password"
                initialValues={{ email }}
                onFinish={handleSubmit}
                layout="vertical"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: 'email', message: 'Vui lòng nhập địa chỉ email hợp lệ!' }]}
                >
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nhập email của bạn"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                    >
                        Gửi yêu cầu
                    </Button>
                </Form.Item>
            </Form>

            {message && (
                <Alert
                    message={message}
                    type={message.includes('lỗi') ? 'error' : 'success'}
                    showIcon
                    closable
                />
            )}
        </main>
    );
};

export default ResetPasswordPage;
