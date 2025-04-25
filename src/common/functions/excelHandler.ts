import path from 'path'
import fs from 'fs'
import { randomUUID } from 'crypto'
import { ExcelConstants } from '../../constants/excel.constant'
import { DataRow, ListMsg } from '../interface'
import ExcelJS from 'exceljs'

export class ExcelHandler {
     static pushDataFailed(listMsg: ListMsg[], data: DataRow[]): DataRow[] {
          let dataUpdate: DataRow[] = []

          // Initialize REASON field for all rows
          for (let i = 0; i < data.length; i++) {
               if (data[i][ExcelConstants.REASON]) {
                    data[i][ExcelConstants.REASON] = ''
               }
          }

          // Collect reasons by row number
          const reasonsByRow: { [row: number]: string[] } = {}
          for (let i = 0; i < listMsg.length; i++) {
               const row = listMsg[i].row
               const message = listMsg[i].message
               if (!reasonsByRow[row]) {
                    reasonsByRow[row] = []
               }
               reasonsByRow[row].push(message)
          }

          // Add reasons to corresponding rows
          for (const row in reasonsByRow) {
               const rowIndex = Number(row) - 1
               const reasons = reasonsByRow[row].join('\n')
               data[rowIndex][ExcelConstants.REASON] = reasons
          }

          // Collect rows with non-empty reasons
          for (let i = 0; i < data.length; i++) {
               if (
                    data[i][ExcelConstants.REASON] !== '' &&
                    data[i][ExcelConstants.REASON] !== null
               ) {
                    dataUpdate.push(data[i])
               }
          }

          return dataUpdate
     }

     formatDate(date: string) {
          const d = new Date(date)
          const year = d.getFullYear()
          const month = String(d.getMonth() + 1).padStart(2, '0') // Tháng bắt đầu từ 0
          const day = String(d.getDate()).padStart(2, '0')

          return `${year}/${month}/${day}`
     }

     formatDate2(date: string) {
          const d = new Date(date)
          const year = d.getFullYear()
          const month = (d.getMonth() + 1).toString().padStart(2, '0') // Ensure two digits for month
          return `${year}/${month}`
     }

     static makeFilePath(dir: string, inputFilePath: string | null) {
          let inputFileName
          if (inputFilePath != null) {
               inputFileName = path.parse(inputFilePath).name
          } else {
               inputFileName = randomUUID()
          }
          const outputDir = `./uploads/excels/${dir}`
          if (!fs.existsSync(outputDir)) {
               fs.mkdirSync(outputDir)
          }

          return path.join(outputDir, `${inputFileName}.xlsx`)
     }

     formatString(str: string) {
          let lowercaseStr = str.toLowerCase().trim()

          let formattedStr =
               lowercaseStr.charAt(0).toUpperCase() + lowercaseStr.slice(1)

          return formattedStr
     }

     static dropDownSheetWithLongData(
          worksheet: any,
          list: string[],
          col: string,
          colHidden: string,
          headers: any[],
          start: number = 2,
          end: number = 1000
     ) {
          // Save the list data in the hidden column
          list.forEach((item: string, index: number) => {
               worksheet.getCell(`${colHidden}${index + 1}`).value = item
          })

          // Hide the hidden column
          worksheet.getColumn(colHidden).hidden = true

          // Create a dropdown for the specified column, referencing the hidden column
          let formula: string
          if (list.length > 0) {
               formula = `=$${colHidden}$1:$${colHidden}$${list.length}`
          } else {
               // If the list is empty, create a dropdown with an empty element
               formula = '=""'
          }

          worksheet.dataValidations.add(`${col}${start}:${col}${end}`, {
               type: 'list',
               allowBlank: true,
               formulae: [formula],
               showErrorMessage: true,
               errorStyle: 'error',
               errorTitle: 'Error',
               error: 'Please select a value from the dropdown list.',
          })

          // Unlock all the cells from the start row to the end row
          for (let row = start; row <= end; row++) {
               for (let colIndex = 1; colIndex <= headers.length; colIndex++) {
                    const cell = worksheet.getCell(row, colIndex)
                    cell.protection = {
                         locked: false,
                    }
               }
          }

          // Protect the worksheet with a password
          worksheet.protect('0000', {
               insertColumns: false,
          })
     }

     static formatSheet(worksheet: ExcelJS.Worksheet, headers: any[]) {
          worksheet.columns.forEach((column) => {
               // if (
               //      column.key &&
               //      [
               //           ExcelConstants.MAINTENANCE_DATE,
               //           ExcelConstants.ENTRY_DATE,
               //      ].includes(column.key)
               // ) {
               // column.numFmt = 'dd/mm/yyyy'
               // } else {
               column.numFmt = '@'
               // }
          })

          // Mở khóa cho các ô
          // for (let row = 1; row <= 5000; row++) {
          //   for (let col = 1; col <= headers.length; col++) {
          //     let cell = worksheet.getCell(row, col);
          //     // cell.style.wrapText = true;
          //     // worksheet.getCell(row, col).alignment = {
          //     //   wrapText: true,
          //     //   vertical: "center",
          //     //   horizontal: "center",
          //     // };
          //     cell.protection = {
          //       locked: false,
          //       hidden: false,
          //     };
          //   }
          // }

          // Bảo vệ sheet
          // worksheet.protect("123", {
          //   selectLockedCells: true,
          //   selectUnlockedCells: true,
          //   formatCells: true,
          //   formatColumns: true,
          //   formatRows: true,
          //   insertColumns: false,
          //   insertRows: false,
          //   insertHyperlinks: false,
          //   deleteColumns: false,
          //   deleteRows: false,
          //   sort: false,
          //   autoFilter: false,
          //   pivotTables: false,
          // });
          // Mở khóa cho các ô
          // for (let row = 2; row <= 5000; row++) {
          //   for (let col = 1; col <= headers.length; col++) {
          //     let cell = worksheet.getCell(row, col);
          //     cell.protection = {
          //       locked: false,
          //     };
          //   }
          // }

          // // Bảo vệ sheet
          // worksheet.protect("0000", {
          //   insertColumns: false,
          // });
     }

     static styleHeader(worksheet: ExcelJS.Worksheet, headers: string[]) {
          for (let row = 1; row <= 1; row++) {
               for (let col = 1; col <= headers.length; col++) {
                    const cell = worksheet.getCell(row, col)

                    cell.font = {
                         bold: true,
                         color: { argb: '000000' },
                         size: 11,
                    }
                    cell.fill = {
                         type: 'pattern',
                         pattern: 'solid',
                         fgColor: { argb: 'dbe5f1' },
                    }
                    if (col != headers.length) {
                         cell.alignment = {
                              wrapText: true,
                              vertical: 'middle',
                              horizontal: 'center',
                         }
                    }

                    cell.border = {
                         top: {
                              style: 'thin',
                              color: { argb: '000000' },
                         },
                         left: {
                              style: 'thin',
                              color: { argb: '000000' },
                         },
                         bottom: {
                              style: 'thin',
                              color: { argb: '000000' },
                         },
                         right: {
                              style: 'thin',
                              color: { argb: '000000' },
                         },
                    }
               }
          }
     }
}

// wrapTextMethod(worksheet, columns) {
//      for (let row = 4; row <= 5000; row++) {
//           for (let col = 0; col < columns.length; col++) {
//                worksheet.getCell(`${columns[col]}${row}`).alignment = {
//                     wrapText: true,
//                     vertical: 'top',
//                     horizontal: 'left',
//                }
//           }
//      }
// }

// wrapTextAllSheet(worksheet, columns) {
//      for (let row = 4; row <= 5000; row++) {
//           for (let col = 1; col <= columns.length; col++) {
//                const cell = worksheet.getCell(row, col)
//                cell.alignment = {
//                     wrapText: true,
//                     vertical: 'top',
//                     horizontal: 'left',
//                }
//           }
//      }
// }

// filterDataEmpty(data) {
//      return data.filter((item) => {
//           return Object.values(item).some((value) => value != null)
//      })
// }

// insertHeader(worksheet, headers, numRow) {
//      worksheet.columns = headers.map((header) => ({
//           header,
//           key: header,
//           width: header.length + 2,
//      }))

//      const headerRow = worksheet.getRow(numRow)
//      headerRow.font = { bold: true, color: { argb: 'FF000000' } }
//      headerRow.alignment = { horizontal: 'left' }
// }

// insertHeaderItem(header, width) {
//      return {
//           header,
//           key: header,
//           width: width,
//      }
// }

// toRoman(num: number) {
//      const romanNumerals = [
//           ['M', 1000],
//           ['CM', 900],
//           ['D', 500],
//           ['CD', 400],
//           ['C', 100],
//           ['XC', 90],
//           ['L', 50],
//           ['XL', 40],
//           ['X', 10],
//           ['IX', 9],
//           ['V', 5],
//           ['IV', 4],
//           ['I', 1],
//      ]
//      let result = ''
//      for (let [roman, value] of romanNumerals) {
//           while (num >= value) {
//                result += roman
//                num -= value
//           }
//      }
//      return result
// }
