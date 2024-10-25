import { EmployeeDto } from "../models/employeeDto";
import { AxiosResponse } from "axios";
import baseUrl from "../apis/base";
import baseUrlPost from "../apis/basepost";
import baseUrlDelete from "../apis/basedelete";


export const Employee = "employee";
export const sreachTerm = '';

export const GetAllEmployees = async (pageSize: number, pageIndex: number, sreachTerm: string) => {
    //console.log(`${baseUrl}/${Employee}?page=${pageIndex}&pageSize=${pageSize}`);
    const res = await baseUrl.get<EmployeeDto[]>(`${Employee}?page=${pageIndex}&pageSize=${pageSize}&searchTerm=${sreachTerm}`)
        //const res = await baseUrl.get<EmployeeDto[]>(`https://localhost:7057/api/employee?page=${pageIndex}&pageSize=${pageSize}`)
        .then((response: AxiosResponse) => {
            console.log(response.data.value);
            return response.data.value;
        }).catch((error) => {
            console.log(error);
            return error;
        });
    return res;
}

export const CreateEmployee = async (formData: FormData) => {
    const res = await baseUrlPost.postForm('/employee', formData);
    return res.data;
}
export const DeleteEmployee = async (id: string) => {
    const res = await baseUrlDelete.delete(`${Employee}/${id}`);
    return res.data;
}