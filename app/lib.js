import { Platform } from 'react-native';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { Asset } from 'expo-asset';
import { manipulateAsync } from 'expo-image-manipulator';

import moment from 'moment';

export function isNumber(char) {
  if (typeof char !== 'string') {
    return false;
  }

  if (char.trim() === '') {
    return false;
  }

  return !isNaN(char);
}

// let a = [
//   "",
//   "one ",
//   "two ",
//   "three ",
//   "four ",
//   "five ",
//   "six ",
//   "seven ",
//   "eight ",
//   "nine ",
//   "ten ",
//   "eleven ",
//   "twelve ",
//   "thirteen ",
//   "fourteen ",
//   "fifteen ",
//   "sixteen ",
//   "seventeen ",
//   "eighteen ",
//   "nineteen ",
// ];
// let b = [
//   "",
//   "",
//   "twenty",
//   "thirty",
//   "forty",
//   "fifty",
//   "sixty",
//   "seventy",
//   "eighty",
//   "ninety",
// ];

// function inWords(num) {
//   if ((num = num.toString()).length > 9) return "";
//   let n = ("000000000" + num)
//     .substr(-9)
//     .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
//   if (!n) return;
//   let str = "";
//   str +=
//     n[1] != 0
//       ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "crore "
//       : "";
//   str +=
//     n[2] != 0
//       ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "lakh "
//       : "";
//   str +=
//     n[3] != 0
//       ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "thousand "
//       : "";
//   str +=
//     n[4] != 0
//       ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "hundred "
//       : "";
//   str +=
//     n[5] != 0
//       ? (str != "" ? "and " : "") +
//         (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]])
//       : "";
//   return str + "only ";
// }

export const generateCashPdf = async (data) => {
  const dateFormatToShow = 'DD-MM-YYYY';

  console.log('data', data);

  let logos = `<th rowspan="2">
  <img src="https://iskconmayapur.syscentricdev.com/public/backend/logo/iskcon.jpg" width="128" alt="ISKCON LOGO">
</th>
<th colspan="3">
  <b>Cash Deposit Slip</b>
</th>
<th rowspan="2" colspan="2">
  <img src="https://iskconmayapur.syscentricdev.com/public/backend/logo/hdfc.jpg" width="128" alt="HDFC LOGO">
</th>`;

  // const asset = Asset.fromModule(require('../../assets/logo.png'));

  // if (Platform.OS === "ios") {
  //   const appLogoAsset = Asset.fromModule(require("../app/assets/logo.png"));
  //   const hdfcLogoAsset = Asset.fromModule(
  //     require("../app/assets/hdfclogo.png")
  //   );
  //   const appLogo = await manipulateAsync(
  //     appLogoAsset.localUri ?? appLogoAsset.uri,
  //     [],
  //     {
  //       base64: true,
  //     }
  //   );

  //   const hdfcLogo = await manipulateAsync(
  //     hdfcLogoAsset.localUri ?? hdfcLogoAsset.uri,
  //     [],
  //     {
  //       base64: true,
  //     }
  //   );

  //   logos = `<th rowspan="2">
  //                     <img src="data:image/jpeg;base64,${appLogo.base64}" width="128" alt="ISKCON LOGO">
  //                 </th>
  //                 <th colspan="3">
  //                     <b>Cash Deposit Slip</b>
  //                 </th>
  //                 <th rowspan="2" colspan="2">
  //                     <img src="data:image/jpeg;base64,${hdfcLogo.base64}" width="128" alt="HDFC LOGO">
  //                 </th>`;
  // }

  // if (Platform.OS === "android") {
  //   logos = `<th rowspan="2">
  //                     <img src="../app/assets/logo.png" width="128" alt="ISKCON LOGO">
  //                 </th>
  //                 <th colspan="3">
  //                     <b>Cash Deposit Slip</b>
  //                 </th>
  //                 <th rowspan="2" colspan="2">
  //                     <img src="../app/assets/hdfclogo.png" width="128" alt="HDFC LOGO">
  //                 </th>`;
  // }

  const html = `
  <!DOCTYPE html>
  <html>

  <head>
      <title>Cash Deposit</title>
      <style type="text/css">
          table {
              font-family: Arial, Helvetica, sans-serif;
              font-size: 12px;
              border: 1px solid #000;
              width: 100%;
              max-width: 768px;
              margin: 0 auto;
              margin-bottom: 1rem;
              color: #000;
              border-collapse: collapse;
          }

          table thead td,
          table thead th {
              border-bottom-width: 2px;
          }

          table thead th {
              vertical-align: bottom;
              border-bottom: 2px solid #000;
          }

          table td,
          table th {
              border: 1px solid #000;
          }

          table td,
          table th {
              padding: 0.25rem;
              vertical-align: top;
              border-top: 1px solid #000;
          }

          .text-left {
              text-align: left;
          }

          .text-center {
              text-align: center;
          }

          .text-right {
              text-align: right;
          }

          b {
              font-weight: 800;
              font-size: 15px;
          }
      </style>
  </head>

  <body>
      <table>
          <thead>
              <tr>
                  ${logos}
              </tr>
              <tr>
                  <th>Original</th>
                  <th>Duplicate</th>
                  <th>Triplicate</th>
              </tr>
          </thead>
          <tr>
              <th class="text-left">Reference ID</th>
              <td colspan="3">${data.report.deposit.deposit_no}</td>
              <th class="text-left">Date</th>
              <td>${moment(data.date).format(dateFormatToShow)}</td>
          </tr>
          <tr>
              <th class="text-left">Deposited at (Branch)</th>
              <td colspan="5">${data.branch_name}</td>
          </tr>
          <tr>
              <th class="text-left">Branch Code or IFSC</th>
              <td colspan="5">${data.report.deposit.ifsc_code}</td>
          </tr>
          <tr>
              <th class="text-left">Client Code</th>
              <td colspan="5">${data.report.deposit.client_code}</td>
          </tr>
          <tr>
              <th class="text-left">Deposited in favour of (Name)</th>
              <td colspan="5">${data.report.deposit.favour}</td>
          </tr>
          <tr>
              <th class="text-left">Deposited into (A/c. No.)</th>
              <td colspan="5">${data.report.deposit.accno}</td>
          </tr>
          <tr>
              <th colspan="4">Denomination</th>
              <th>Count</th>
              <th>Amount (Rs.)</th>
          </tr>
          <tr>
              <th colspan="3">Rs. 2,000.00</th>
              <th>X</th>
              <td class="text-center"></td>
              <td class="text-right"></td>
          </tr>
          <tr>
              <th colspan="3">Rs. 500.00</th>
              <th>X</th>
              <td class="text-center"></td>
              <td class="text-right"></td>
          </tr>
          <tr>
              <th colspan="3">Rs. 200.00</th>
              <th>X</th>
              <td class="text-center"></td>
              <td class="text-right"></td>
          </tr>
          <tr>
              <th colspan="3">Rs. 100.00</th>
              <th>X</th>
              <td class="text-center"></td>
              <td class="text-right"></td>
          </tr>
          <tr>
              <th colspan="3">Rs. 50.00</th>
              <th>X</th>
              <td class="text-center"></td>
              <td class="text-right"></td>
          </tr>
          <tr>
              <th colspan="3">Rs. 20.00</th>
              <th>X</th>
              <td class="text-center"></td>
              <td class="text-right"></td>
          </tr>
          <tr>
              <th colspan="3">Rs. 10.00</th>
              <th>X</th>
              <td class="text-center"></td>
              <td class="text-right"></td>
          </tr>
          <tr>
              <th colspan="3">Others</th>
              <th>X</th>
              <td class="text-center"></td>
              <td class="text-right"></td>
          </tr>
          <tr>
              <th colspan="5">Total</th>
              <td class="text-right">${data.amount.toFixed(2)}</td>
          </tr>
          <tr>
              <th class="text-left">Amount (in words)</th>
              <td colspan="5">${data.report.deposit.inward}</td>
          </tr>
          <tr>
              <th class="text-left">Depositor's (Collector) Name</th>
              <td colspan="5">${data.report.collector.name}</td>
          </tr>
          <tr>
              <th class="text-left">Depositor's (Collector) ID</th>
              <td colspan="2">${data.report.collector.unique_id}</td>
              <th class="text-left">Contact No</th>
              <td colspan="2">${data.report.collector.phone}</td>
          </tr>
          <tr>
              <th>Teller's Signature</th>
              <th colspan="2">Deposit Transaction ID</th>
              <th colspan="3">Depositor's Signature</th>
          </tr>
          <tr style="height:80px">
              <td class="text-center"></td>
              <td class="text-center" colspan="2"></td>
              <td class="text-center" colspan="3"></td>
          </tr>
      </table>
  </body>

  </html>
  `;

  const file = await printToFileAsync({
    html: html,
    base64: false,
  });

  await shareAsync(file.uri);
};

export const generateChequePdf = async ({ depositData, depositDetails }) => {
  const dateFormatToShow = 'DD-MM-YYYY';

  // const appLogoAsset = Asset.fromModule(require("../app/assets/logo.png"));
  // const appLogo = await manipulateAsync(
  //   appLogoAsset.localUri ?? appLogoAsset.uri,
  //   [],
  //   {
  //     base64: true,
  //   }
  // );

  // const hdfcLogoAsset = Asset.fromModule(require("../app/assets/hdfclogo.png"));
  // const hdfcLogo = await manipulateAsync(
  //   hdfcLogoAsset.localUri ?? hdfcLogoAsset.uri,
  //   [],
  //   {
  //     base64: true,
  //   }
  // );

  const detailsRow = depositDetails.map((data, key) => {
    return `<tr>
              <td class="text-center">${data.key}</td>
              <td class="text-center">${moment(data.created_at).format(
                dateFormatToShow
              )}</td>
              <td class="text-center">${data.donation_name}</td>
              <td colspan="3">${data.donation_name}</td>
              <td colspan="2" class="text-right">${data.donation_amount}</td>
          </tr>`;
  });

  const html = `
    <!DOCTYPE html>
  <html>

  <head>
      <title>Cheque Deposit</title>
      <style type="text/css">
          table {
              font-family: Arial, Helvetica, sans-serif;
              font-size: 12px;
              border: 1px solid #000;
              width: 100%;
              max-width: 768px;
              margin: 0 auto;
              margin-bottom: 1rem;
              color: #000;
              border-collapse: collapse;
          }

          table thead td,
          table thead th {
              border-bottom-width: 2px;
          }

          table thead th {
              vertical-align: bottom;
              border-bottom: 2px solid #000;
          }

          table td,
          table th {
              border: 1px solid #000;
          }

          table td,
          table th {
              padding: 0.25rem;
              vertical-align: top;
              border-top: 1px solid #000;
          }

          .text-left {
              text-align: left;
          }

          .text-center {
              text-align: center;
          }

          .text-right {
              text-align: right;
          }

          b {
              font-weight: 800;
              font-size: 15px;
          }
      </style>
  </head>

  <body>
      <table>
          <thead>
              <tr>
                <th colspan="2" width="26%" rowspan="2">
                    <img src="https://iskconmayapur.syscentricdev.com/public/backend/logo/iskcon.jpg" width="128" alt="ISKCON LOGO">
                </th>
                <th colspan="3" width="48%">
                    <b>Cheque Deposit Slip</b>
                </th>
                <th rowspan="2" width="26%" colspan="2">
                    <img src="https://iskconmayapur.syscentricdev.com/public/backend/logo/hdfc.jpg" width="128" alt="HDFC LOGO">
                </th>
              </tr>
              <tr>
                  <th>Original</th>
                  <th>Duplicate</th>
                  <th>Triplicate</th>
              </tr>
          </thead>
          <tr>
              <th colspan="2" class="text-left">Reference ID</th>
              <td colspan="3">${depositData.report.deposit.deposit_no}</td>
              <th class="text-left">Date</th>
              <td>${moment(depositData.date).format(dateFormatToShow)}</td>
          </tr>
          <tr>
              <th colspan="2" class="text-left">Deposited at (Branch)</th>
              <td colspan="5">${depositData.report.deposit.branch_name}</td>
          </tr>
          <tr>
              <th colspan="2" class="text-left">Branch Code or IFSC</th>
              <td colspan="5">${depositData.report.deposit.ifsc_code}</td>
          </tr>
          <tr>
              <th colspan="2" class="text-left">Client Code</th>
              <td colspan="5">${depositData.report.deposit.client_code}</td>
          </tr>
          <tr>
              <th colspan="2" class="text-left">Deposited in favour of (Name)</th>
              <td colspan="5">${depositData.report.deposit.favour}</td>
          </tr>
          <tr>
              <th colspan="2" class="text-left">Deposited into (A/c. No.)</th>
              <td colspan="5">${depositData.report.deposit.accno}</td>
          </tr>
          <!-- </table>
      <table> -->
          <tr>
              <th width="7%">SL No.</th>
              <th width="18%">Cheque Date</th>
              <th>Cheque No.</th>
              <th colspan="3">Bank & Branch</th>
              <th colspan="2">Amount (Rs.)</th>
          </tr>

          ${detailsRow}
          
          <tr>
              <th colspan="6">Total</th>
              <td class="text-right">${depositData.report.deposit.amount.toFixed(
                2
              )}</td>
          </tr>
          <tr>
              <th colspan="2" class="text-left">Amount (in words)</th>
              <td colspan="5">${depositData.report.deposit.inward}</td>
          </tr>
          <tr>
              <th colspan="2" class="text-left">Depositor's (Collector) Name</th>
              <td colspan="5">${depositData.report.collector.name}</td>
          </tr>
          <tr>
              <th colspan="2" class="text-left">Depositor's (Collector) ID</th>
              <td colspan="2">${depositData.report.collector.unique_id}</td>
              <th class="text-left">Contact No</th>
              <td colspan="2">${depositData.report.collector.phone}</td>
          </tr>
          <tr>
              <th colspan="2">Teller's Signature</th>
              <th colspan="2">Deposit Transaction ID</th>
              <th colspan="3">Depositor's Signature</th>
          </tr>
          <tr style="height:80px">
              <td class="text-center" colspan="2"></td>
              <td class="text-center" colspan="2"></td>
              <td class="text-center" colspan="3"></td>
          </tr>
      </table>
  </body>

  </html>
    `;

  const file = await printToFileAsync({
    html: html,
    base64: false,
  });

  await shareAsync(file.uri);
};

export const generateCashPdfFromDeposit = async (data) => {
  const dateFormatToShow = 'DD-MM-YYYY';

  console.log('data', data);

  let logos = `<th rowspan="2">
  <img src="https://iskconmayapur.syscentricdev.com/public/backend/logo/iskcon.jpg" width="128" alt="ISKCON LOGO">
</th>
<th colspan="3">
  <b>Cash Deposit Slip</b>
</th>
<th rowspan="2" colspan="2">
  <img src="https://iskconmayapur.syscentricdev.com/public/backend/logo/hdfc.jpg" width="128" alt="HDFC LOGO">
</th>`;

  // const asset = Asset.fromModule(require('../../assets/logo.png'));
  // const appLogoAsset = Asset.fromModule(require("../app/assets/logo.png"));
  // const appLogo = await manipulateAsync(
  //   appLogoAsset.localUri ?? appLogoAsset.uri,
  //   [],
  //   {
  //     base64: true,
  //   }
  // );

  // const hdfcLogoAsset = Asset.fromModule(require("../app/assets/hdfclogo.png"));
  // const hdfcLogo = await manipulateAsync(
  //   hdfcLogoAsset.localUri ?? hdfcLogoAsset.uri,
  //   [],
  //   {
  //     base64: true,
  //   }
  // );

  const html = `
  <!DOCTYPE html>
  <html>

  <head>
      <title>Cash Deposit</title>
      <style type="text/css">
          table {
              font-family: Arial, Helvetica, sans-serif;
              font-size: 12px;
              border: 1px solid #000;
              width: 100%;
              max-width: 768px;
              margin: 0 auto;
              margin-bottom: 1rem;
              color: #000;
              border-collapse: collapse;
          }

          table thead td,
          table thead th {
              border-bottom-width: 2px;
          }

          table thead th {
              vertical-align: bottom;
              border-bottom: 2px solid #000;
          }

          table td,
          table th {
              border: 1px solid #000;
          }

          table td,
          table th {
              padding: 0.25rem;
              vertical-align: top;
              border-top: 1px solid #000;
          }

          .text-left {
              text-align: left;
          }

          .text-center {
              text-align: center;
          }

          .text-right {
              text-align: right;
          }

          b {
              font-weight: 800;
              font-size: 15px;
          }
      </style>
  </head>

  <body>
      <table>
          <thead>
              <tr>
              ${logos}
              </tr>
              <tr>
                  <th>Original</th>
                  <th>Duplicate</th>
                  <th>Triplicate</th>
              </tr>
          </thead>
          <tr>
              <th class="text-left">Reference ID</th>
              <td colspan="3">${data.deposit.deposit_no}</td>
              <th class="text-left">Date</th>
              <td>${moment(data?.deposit?.date).format(dateFormatToShow)}</td>
          </tr>
          <tr>
              <th class="text-left">Deposited at (Branch)</th>
              <td colspan="5">${data.deposit.branch_name}</td>
          </tr>
          <tr>
              <th class="text-left">Branch Code or IFSC</th>
              <td colspan="5">${data.deposit.ifsc_code}</td>
          </tr>
          <tr>
              <th class="text-left">Client Code</th>
              <td colspan="5">${data.deposit.client_code}</td>
          </tr>
          <tr>
              <th class="text-left">Deposited in favour of (Name)</th>
              <td colspan="5">${data.deposit.favour}</td>
          </tr>
          <tr>
              <th class="text-left">Deposited into (A/c. No.)</th>
              <td colspan="5">${data.deposit.accno}</td>
          </tr>
          <tr>
              <th colspan="4">Denomination</th>
              <th>Count</th>
              <th>Amount (Rs.)</th>
          </tr>
          <tr>
              <th colspan="3">Rs. 2,000.00</th>
              <th>X</th>
              <td class="text-center"></td>
              <td class="text-right"></td>
          </tr>
          <tr>
              <th colspan="3">Rs. 500.00</th>
              <th>X</th>
              <td class="text-center"></td>
              <td class="text-right"></td>
          </tr>
          <tr>
              <th colspan="3">Rs. 200.00</th>
              <th>X</th>
              <td class="text-center"></td>
              <td class="text-right"></td>
          </tr>
          <tr>
              <th colspan="3">Rs. 100.00</th>
              <th>X</th>
              <td class="text-center"></td>
              <td class="text-right"></td>
          </tr>
          <tr>
              <th colspan="3">Rs. 50.00</th>
              <th>X</th>
              <td class="text-center"></td>
              <td class="text-right"></td>
          </tr>
          <tr>
              <th colspan="3">Rs. 20.00</th>
              <th>X</th>
              <td class="text-center"></td>
              <td class="text-right"></td>
          </tr>
          <tr>
              <th colspan="3">Rs. 10.00</th>
              <th>X</th>
              <td class="text-center"></td>
              <td class="text-right"></td>
          </tr>
          <tr>
              <th colspan="3">Others</th>
              <th>X</th>
              <td class="text-center"></td>
              <td class="text-right"></td>
          </tr>
          <tr>
              <th colspan="5">Total</th>
              <td class="text-right">${data.deposit.amount.toFixed(2)}</td>
          </tr>
          <tr>
              <th class="text-left">Amount (in words)</th>
              <td colspan="5">${data.deposit.inward}</td>
          </tr>
          <tr>
              <th class="text-left">Depositor's (Collector) Name</th>
              <td colspan="5">${data.collector.name}</td>
          </tr>
          <tr>
              <th class="text-left">Depositor's (Collector) ID</th>
              <td colspan="2">${data.collector.unique_id}</td>
              <th class="text-left">Contact No</th>
              <td colspan="2">${data.collector.phone}</td>
          </tr>
          <tr>
              <th>Teller's Signature</th>
              <th colspan="2">Deposit Transaction ID</th>
              <th colspan="3">Depositor's Signature</th>
          </tr>
          <tr style="height:80px">
              <td class="text-center"></td>
              <td class="text-center" colspan="2"></td>
              <td class="text-center" colspan="3"></td>
          </tr>
      </table>
  </body>

  </html>
  `;

  const file = await printToFileAsync({
    html: html,
    base64: false,
  });

  await shareAsync(file.uri);
};

export const generateChequePdfFromDeposit = async (data) => {
  const dateFormatToShow = 'DD-MM-YYYY';

  // const appLogoAsset = Asset.fromModule(require("../app/assets/logo.png"));
  // const appLogo = await manipulateAsync(
  //   appLogoAsset.localUri ?? appLogoAsset.uri,
  //   [],
  //   {
  //     base64: true,
  //   }
  // );

  // const hdfcLogoAsset = Asset.fromModule(require("../app/assets/hdfclogo.png"));
  // const hdfcLogo = await manipulateAsync(
  //   hdfcLogoAsset.localUri ?? hdfcLogoAsset.uri,
  //   [],
  //   {
  //     base64: true,
  //   }
  // );

  const detailsRow = data?.deposit?.transactions.map((data, key) => {
    return `<tr>
              <td class="text-center">${key * 1 + 1}</td>
              <td class="text-center">${moment(data.cheque_date).format(
                dateFormatToShow
              )}</td>
              <td class="text-center">${data.cheque_no}</td>
              <td colspan="3">${data.bank_name}, ${data.bank_branch}</td>
              <td colspan="2" class="text-right">${data.donation_amount}</td>
          </tr>`;
  });

  const html = `
    <!DOCTYPE html>
  <html>

  <head>
      <title>Cheque Deposit</title>
      <style type="text/css">
          table {
              font-family: Arial, Helvetica, sans-serif;
              font-size: 12px;
              border: 1px solid #000;
              width: 100%;
              max-width: 768px;
              margin: 0 auto;
              margin-bottom: 1rem;
              color: #000;
              border-collapse: collapse;
          }

          table thead td,
          table thead th {
              border-bottom-width: 2px;
          }

          table thead th {
              vertical-align: bottom;
              border-bottom: 2px solid #000;
          }

          table td,
          table th {
              border: 1px solid #000;
          }

          table td,
          table th {
              padding: 0.25rem;
              vertical-align: top;
              border-top: 1px solid #000;
          }

          .text-left {
              text-align: left;
          }

          .text-center {
              text-align: center;
          }

          .text-right {
              text-align: right;
          }

          b {
              font-weight: 800;
              font-size: 15px;
          }
      </style>
  </head>

  <body>
      <table>
          <thead>
              <tr>
                <th colspan="2" width="26%" rowspan="2">
                    <img src="https://iskconmayapur.syscentricdev.com/public/backend/logo/iskcon.jpg" width="128" alt="ISKCON LOGO">
                </th>
                <th colspan="3" width="48%">
                    <b>Cheque Deposit Slip</b>
                </th>
                <th rowspan="2" width="26%" colspan="2">
                    <img src="https://iskconmayapur.syscentricdev.com/public/backend/logo/hdfc.jpg" width="128" alt="HDFC LOGO">
                </th>
              </tr>
              <tr>
                  <th>Original</th>
                  <th>Duplicate</th>
                  <th>Triplicate</th>
              </tr>
          </thead>
          <tr>
              <th colspan="2" class="text-left">Reference ID</th>
              <td colspan="3">${data.deposit.deposit_no}</td>
              <th class="text-left">Date</th>
              <td>${moment(data?.depositData?.date).format(
                dateFormatToShow
              )}</td>
          </tr>
          <tr>
              <th colspan="2" class="text-left">Deposited at (Branch)</th>
              <td colspan="5">${data.deposit.branch_name}</td>
          </tr>
          <tr>
              <th colspan="2" class="text-left">Branch Code or IFSC</th>
              <td colspan="5">${data.deposit.ifsc_code}</td>
          </tr>
          <tr>
              <th colspan="2" class="text-left">Client Code</th>
              <td colspan="5">${data.deposit.client_code}</td>
          </tr>
          <tr>
              <th colspan="2" class="text-left">Deposited in favour of (Name)</th>
              <td colspan="5">${data.deposit.favour}</td>
          </tr>
          <tr>
              <th colspan="2" class="text-left">Deposited into (A/c. No.)</th>
              <td colspan="5">${data.deposit.accno}</td>
          </tr>
          <!-- </table>
      <table> -->
          <tr>
              <th width="7%">SL No.</th>
              <th width="18%">Cheque Date</th>
              <th>Cheque No.</th>
              <th colspan="3">Bank & Branch</th>
              <th colspan="2">Amount (Rs.)</th>
          </tr>

          ${detailsRow}
          
          <tr>
              <th colspan="6">Total</th>
              <td class="text-right">${data.deposit.amount.toFixed(2)}</td>
          </tr>
          <tr>
              <th colspan="2" class="text-left">Amount (in words)</th>
              <td colspan="5">${data.deposit.inward}</td>
          </tr>
          <tr>
              <th colspan="2" class="text-left">Depositor's (Collector) Name</th>
              <td colspan="5">${data.collector.name}</td>
          </tr>
          <tr>
              <th colspan="2" class="text-left">Depositor's (Collector) ID</th>
              <td colspan="2">${data.collector.unique_id}</td>
              <th class="text-left">Contact No</th>
              <td colspan="2">${data.collector.phone}</td>
          </tr>
          <tr>
              <th colspan="2">Teller's Signature</th>
              <th colspan="2">Deposit Transaction ID</th>
              <th colspan="3">Depositor's Signature</th>
          </tr>
          <tr style="height:80px">
              <td class="text-center" colspan="2"></td>
              <td class="text-center" colspan="2"></td>
              <td class="text-center" colspan="3"></td>
          </tr>
      </table>
  </body>

  </html>
    `;

  const file = await printToFileAsync({
    html: html,
    base64: false,
  });

  await shareAsync(file.uri);
};
