import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";
import { toggle } from "@heroui/theme";

import React, { useState } from "react";
import { createRoot } from "react-dom/client";

const columns = [
  {
    key: "identity",
    label: "Identity"
  },
  {
    key: "languages",
    label: "Language(s)",
  },
  {
    key: "location",
    label: "Location",
    sortable: true
  },
  {
    key: "country",
    label: "Country",
  },
  {
    key: "actions",
    label: "",
  }
];

export const FacilitatorGrid = ({ facilitatorList }: { facilitatorList: any }) => {

  const rows = facilitatorList.map((facilitator: any) => ({
    key: facilitator.id,
    firstName: facilitator.firstName,
    lastName: facilitator.lastName,
    yearsOfExperience: facilitator.yearsOfExperience,
    languages: facilitator.languages,
    country: facilitator.country,
    location: facilitator.location,
    website: facilitator.website
  }));

  const classNames = React.useMemo(
    () => ({
      wrapper: ["border-1 border-gray-300 bg-gray-100 rounded-xl shadow-lg/25 pt-3 pb-2 md:w-fit md:max-w-full lg:w-3/4 min-w-7/8 mx-auto px-0"],
      th: [ "border-gray-400", "text-sm", "text-left", "text-gray-400", "pb-3", "pb-2", "uppercase"],
      tr: [ "border-1 border-gray-100 " ]
    }),
    [],
  );
  
  function RenderCell({ item, columnKey }: any) {
    const value = getKeyValue(item, columnKey);
    switch (columnKey) {
      case "identity":
        return (
          <div className="flex flex-row items-center">
            <div
              style={{
                backgroundImage: `url(/facilitator-photos/${item.firstName}${item.lastName}.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "3rem",
                height: "3rem",
                borderRadius: "0.33rem",
                marginRight: "0.33rem",
              }}
              aria-placeholder="/facilitator-photos/placeholder.jpg"
            ></div>
            <div>
              <p className="text-nowrap text-md lg:text-lg text-cool-green solway-medium">{item.firstName} {item.lastName}</p>
            </div>
              
          </div>
        );
        case "languages":
          return (
            <p className="text-gray-500 text-sm md:text-md w-50">{value}</p>
          )
      case "actions":
        const name = `${item.firstName} ${item.lastName}`
        return (
          <div className="text-center">
            <a href={`../contact?book-facilitator=${name}`} className="no-underline">
              <button
                className="rounded-full bg-cool-green text-white font-bold px-2 py-1 md:px-4 manrope-bold text-sm  hover:cursor-pointer hover:bg-orange-300 hover:text-orange-800 focus:bg-warm-green focus:text-white text-nowrap">Request Booking</button>
            </a>
          </div>
        );
      default:
        return <p className="text-gray-500 text-sm md:text-md">{value}</p>;
    }
  }

  return (
    <Table 
    aria-label="Facilitator directory" 
    classNames={classNames}
    id="facilitator-directory-table"
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key} >{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows} emptyContent={"No facilitators found"} >
        {(item) => (

          <TableRow key={item.key} id={`row-${item.key}`} className="border-b-1 border-gray-200 hover:bg-gray-50" >
            {(columnKey) => <TableCell>
              <RenderCell item={item} columnKey={columnKey} />
              </TableCell>}
          </TableRow>
          
        )}

      </TableBody>
    </Table>
  );
};
