import React from 'react';

export const CallbackRequestEmail = ({ firstName, message, productName }) => (
  <html dir="ltr" lang="en">
    <head>
      <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
      <meta name="x-apple-disable-message-reformatting" />
    </head>
    <body style="background-color:#ffffff;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;text-align:center">
      <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:100%;background-color:#ffffff;border:1px solid #ddd;border-radius:5px;margin-top:20px;width:480px;margin:0 auto;padding:12% 6%">
        <tbody>
          <tr style="width:100%">
            <td>
              <p style="font-size:18px;line-height:24px;margin:16px 0;font-weight:bold;text-align:center">TradePlace: Interest in Your Product</p>
              <h1 style="text-align:center">You have a new callback request</h1>
              <p style="font-size:14px;line-height:24px;margin:16px 0;text-align:center">Hello {firstName},</p>
              <p style="font-size:14px;line-height:24px;margin:16px 0;text-align:center">Someone is interested in negotiating your product, <strong>{productName}</strong>. Below is the message they have left:</p>
              <blockquote style="font-style:italic; font-size:14px; color:#444; padding:10px; background:#f9f9f9; border-radius:5px;">
                "{message}"
              </blockquote>
              <p style="font-size:14px;line-height:24px;margin:16px 0;text-align:center">Please reach out to them to discuss further.</p>
              <p style="font-size:14px;line-height:24px;margin:0;color:#444;letter-spacing:0;padding:0 40px;text-align:center">Not expecting this email?</p>
              <p style="font-size:14px;line-height:24px;margin:0;color:#444;letter-spacing:0;padding:0 40px;text-align:center">Contact <a href="mailto:support@tradeplace.com" style="color:#444;text-decoration:underline">support@tradeplace.com</a> if you did not request this callback.</p>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
);
