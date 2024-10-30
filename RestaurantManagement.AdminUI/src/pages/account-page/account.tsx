import { Link } from "react-router-dom";
import axios from 'axios';
import { useEffect, useState } from "react";

const Account = () => {

    const [userInfo, setUserInfo] = useState<any>();


    //gọi api để lấy thông tin của user
    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = sessionStorage.getItem('token');

            const response = await axios.get('https://localhost:7057/api/account/account-info', {
                headers: {
                    'Authorization': `Bearer ${token}`, // Thêm header Authorization
                    'Content-Type': 'application/json'
                }
            });

            setUserInfo(response.data.value);


        }; fetchUserInfo();
        console.log(userInfo);
    }, []);

    return (
        <>
            <form className="">
                <div className="row d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <div className="col ">
                        <nav aria-label="breadcrumb" className="bg-body-tertiary rounded-3 p-3 mb-4 ">
                            <ol className="breadcrumb mb-0 ">
                                <li className="breadcrumb-item"><Link to="/"><dt>Dashboard</dt></Link></li>
                                <li className="breadcrumb-item" aria-current="page">Account</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                {/* <div className="row">
                    <div className="col-12">
                        <div className="row" key={userInfo.value.userId}>
                            <div className="col-md-3 border-right">
                                <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                                    <img className="rounded-circle mt-5" width="200" src={userInfo.value.userImage || 'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg'} alt="" />
                                    <input type="file" ref={userInfo?.userImage} style={{ display: "none" }} accept="image/*" />
                                </div>
                            </div>
                            <div className="col-md-9 border-right">
                                <div className="p-3 py-5">
                                    <div className="row mt-2">
                                        <div className="col-md-6">
                                            <label className="labels">First Name</label>
                                            <input type="text" className="form-control" placeholder="Nhập tên" value={userInfo.value.firstName} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="labels">Last Name</label>
                                            <input type="text" className="form-control" placeholder="Nhập họ" value={userInfo.value.lastName} />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-md-12">
                                            <label className="labels">Email</label>
                                            <input type="text" className="form-control" placeholder="Nhập email" value={userInfo.value.email} />
                                        </div>
                                        <div className="col-md-12">
                                            <label className="labels">Phone Number</label>
                                            <input type="text" className="form-control" placeholder="Nhập số điện thoại" value={userInfo.value.phoneNumber} />
                                        </div>
                                    </div>

                                    <div className="row mt-2">
                                        <div className="col-md-6">
                                            <label className="labels">Gender</label>
                                            <input type="text" className="form-control" value={userInfo.value.gender} />

                                        </div>
                                        <div className="col-md-6">
                                            <label className="labels">Role</label>
                                            <input type="text" className="form-control" value={userInfo.value.role} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </form>
        </>
    );

}

export default Account;