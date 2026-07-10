import { Response } from "express";

interface IResponseData<T> {
  message: string;
  statuscode: number;
  data: T;
}

export const sendResponse = <T>(res: Response, resData: IResponseData<T>) => {
  const { message, statuscode, data } = resData;
  res.status(statuscode).json({
    message,
    data,
    success: String(statuscode).startsWith("2"),
    status: String(statuscode).startsWith("2")
      ? "success"
      : String(statuscode).startsWith("4")
        ? "fail"
        : "error",
  });
};
