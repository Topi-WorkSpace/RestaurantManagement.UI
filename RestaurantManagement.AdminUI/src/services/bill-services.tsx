import { AxiosResponse } from "axios";
import baseUrl from "../apis/base";
import baseUrlDelete from "../apis/basedelete";


export const Bill = "bill";

export const GetAllBill = async (filterUserId: string, searchTerm: string, sortColumn: string, sortOrder: string, page: number, pageSize: number) => {
    try {
        const response: AxiosResponse = await baseUrl.get(`${Bill}?filterUserId=${filterUserId}&searchTerm=${searchTerm}&sortColumn=${sortColumn}&sortOrder=${sortOrder}&page=${page}&pageSize=${pageSize}`);
        console.log(response.data);

        // Ensure response.data.value is always an array
        return response.data;
    } catch (error) {
        console.error("Error fetching bills:", error);
        return []; // Return an empty array on error to avoid mapping issues
    }
}
export const GetBillDetail = async (billId: string) => {
    try {
        const response: AxiosResponse = await baseUrl.get(`${Bill}/${billId}`);
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching bill detail:", error);
        return [];
    }
}

export const ExportBill = async (billId: string) => {
    try {
        const response: AxiosResponse = await baseUrlDelete.get(`${Bill}/bill-export/${billId}`);
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        console.error("Error exporting bill:", error);
        return [];

    }
}