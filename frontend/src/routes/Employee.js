import React from "react";
import { useParams } from "react-router-dom";
import EmployeeInfo from "../components/EmployeeInfo";
import EmployeeTaskList from "../components/EmployeeTaskList";

export default function Employee() {
  let params = useParams();

  return (
    <>
      <EmployeeInfo employeeId={params.employeeId}></EmployeeInfo>
      <EmployeeTaskList employeeId={params.employeeId}></EmployeeTaskList>
    </>
  );
}
