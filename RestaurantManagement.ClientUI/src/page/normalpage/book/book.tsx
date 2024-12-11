import { useEffect, useState } from "react";
import { Input, message, notification, Row } from "antd";
import { BookingSubcribe, CreateBooking, GetAllBooking, GetBookingById } from "../../../services/book-services";
import { BookDto } from "../../../models/bookingDto";
import dayjs from 'dayjs';
import { Descriptions } from 'antd';
import { Link } from "react-router-dom";
import { InfoOutlined } from '@ant-design/icons';


const BookFormOfNormal = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [numberOfCustomer, setNumberOfCustomer] = useState(0);
    const [note, setNote] = useState('');
    const [bookingDetails, setBookingDetails] = useState<any>(null);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Page search
    const [bookings, setBookings] = useState<BookDto[]>([]);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const [filterBookingStatus, setFilterBookingStatus] = useState('');
    const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(8);

    // Fetch booking list for pagination
    useEffect(() => {
        const fecthData = async () => {
            const results = await GetAllBooking(filterBookingStatus, searchTerm, sortColumn, sortOrder, pageSize, pageIndex);
            setBookings(results.items);
            setHasNextPage(results.hasNextPage);
            setHasPreviousPage(results.hasPreviousPage);
            setTotalCount(results.totalCount);
        };
        fecthData();
    }, [filterBookingStatus, searchTerm, sortColumn, sortOrder, pageSize, pageIndex]);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);


    const handleSearchId = async (id: string) => {
        if (id.trim() === '') {
            setBookingDetails(null);
            return;
        }

        setLoading(true);
        try {
            const results = await GetBookingById(id);
            console.log('Booking details:', results);

            if (results) {
                setBookingDetails(results);
            } else {
                setBookingDetails(null);
                notification.error({
                    message: 'Mã booking không tồn tại',
                    description: 'Vui lòng kiểm tra lại mã booking và thử lại',
                });
            }
        } catch (error) {
            console.error("Error fetching booking by id:", error);
            setBookingDetails(null);
            notification.error({
                message: 'Lỗi khi tìm kiếm booking',
                description: 'Vui lòng thử lại sau',
            });
        } finally {
            setLoading(false);
        }
    }
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearchId(e.currentTarget.value);
        }
    };

    // Handle booking form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submit');

        const token = sessionStorage.getItem('token');
        const data = {
            firstName,
            lastName,
            email,
            phoneNumber,
            bookingDate,
            bookingTime: `${bookingTime}:00`,
            numberOfCustomers: numberOfCustomer,
            note
        };

        try {
            if (!token) {
                // Create booking if not logged in
                await CreateBooking(data);
                notification.success({
                    message: 'Booking thành công',
                    description: 'Vui lòng kiểm tra email để xác nhận booking',
                });
            } else {
                // Subscribe to booking if logged in
                await BookingSubcribe(data);
                notification.success({
                    message: 'Booking thành công',
                    description: 'Vui lòng kiểm tra email để xác nhận booking',
                });
            }
        } catch (error) {
            console.error('Error during booking submission:', error);
            notification.error({
                message: 'Lỗi khi đặt bàn',
                description: 'Vui lòng thử lại sau',
            });
        }
    }

    // Handle time change (when the user selects time)
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBookingTime(e.target.value);
    };


    return (

        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <label htmlFor="">Search Booking by ID</label>
                    <Input
                        placeholder="Enter booking ID"
                        onKeyDown={handleKeyPress}// Trigger on each input change
                    />
                </div>
            </div>

            {/* Display booking details if found */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                bookingDetails && (
                    <div className="booking-details mt-4 justify-content-center center col-12 col-offset-6
">
                        <h3>Booking Details</h3>
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="Booking ID">
                                {bookingDetails.bookId}
                            </Descriptions.Item>
                            <Descriptions.Item label="First Name">
                                {bookingDetails.firstName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Last Name">
                                {bookingDetails.lastName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {bookingDetails.email}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phone Number">
                                {bookingDetails.phone}
                            </Descriptions.Item>
                            <Descriptions.Item label="Booking Date">
                                {dayjs(bookingDetails.bookingDate).format('YYYY-MM-DD')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Booking Time">
                                {bookingDetails.bookingTime}
                            </Descriptions.Item>
                            <Descriptions.Item label="Number of People">
                                {bookingDetails.numberOfCustomers}
                            </Descriptions.Item>
                            <Descriptions.Item label="Note">
                                {bookingDetails.note}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                )
            )}
            <Row className="my-3 justify-content-center text-center">
                <div className="position-relative d-inline-block">
                    <h2 className="my-4">
                        Book For Table
                    </h2>
                    <Link to='/rule' className="position-absolute" style={{ left: '100%', transform: 'translateX(-10px) translateY(-50%)' }}>
                        <InfoOutlined title="Điều khoản nhà hàng" />
                    </Link>
                </div>
            </Row>





            {/* Show different form based on login status */}
            {!isLoggedIn ? (
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label>First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label>Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                className="form-control"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label>Day</label>
                            <input
                                type="date"
                                className="form-control"
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <label>Time</label>
                            <input
                                type="time"
                                className="form-control"
                                value={bookingTime}
                                onChange={handleTimeChange}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label>Number of People</label>
                            <input
                                type="number"
                                className="form-control"
                                value={numberOfCustomer}
                                onChange={(e) => setNumberOfCustomer(parseInt(e.target.value))}
                            />
                        </div>
                        <div className="col-md-6">
                            <label>Note</label>
                            <textarea
                                className="form-control"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="text-center my-4">
                        <button type="submit" className="btn btn-success">
                            Book Now
                        </button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label>Day</label>
                            <input
                                type="date"
                                className="form-control"
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <label>Time</label>
                            <input
                                type="time"
                                className="form-control"
                                value={bookingTime}
                                onChange={handleTimeChange}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label>Number of People</label>
                            <input
                                type="number"
                                className="form-control"
                                value={numberOfCustomer}
                                onChange={(e) => setNumberOfCustomer(parseInt(e.target.value))}
                            />
                        </div>
                        <div className="col-md-6">
                            <label>Note</label>
                            <textarea
                                className="form-control"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="text-center my-4">
                        <button type="submit" className="btn btn-success">
                            Book Now
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default BookFormOfNormal;
