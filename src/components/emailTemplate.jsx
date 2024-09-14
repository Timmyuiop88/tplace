import React from "react";

const TradePlaceWelcomeEmail = () => {
  return (
    <>
      <html dir="ltr" lang="en">
        <head>
          <link
            rel="preload"
            as="image"
            href="https://tplace-orpin.vercel.app/img/logo.png"
          />
          <meta content="text/html; charset=UTF-8" />
          <meta name="x-apple-disable-message-reformatting" />
        </head>
        <body
          style={{
            backgroundColor: "rgb(250,251,251)",
            fontSize: "1rem",
            lineHeight: "1.5rem",
            fontFamily:
              'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
          }}
        >
          <img
            alt="TradePlace"
            height="75"
            src="https://tplace-orpin.vercel.app/img/logo.png"
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "20px",
              marginBottom: "20px",
              display: "block",
              outline: "none",
              border: "none",
              textDecoration: "none",
            }}
            width="184"
          />
          <table
            align="center"
            width="100%"
            border="0"
            cellPadding="0"
            cellSpacing="0"
            role="presentation"
            style={{
              backgroundColor: "rgb(255,255,255)",
              padding: "45px",
              maxWidth: "37.5em",
            }}
          >
            <tbody>
              <tr style={{ width: "100%" }}>
                <td>
                  <h1
                    style={{
                      textAlign: "center",
                      marginTop: "0px",
                      marginBottom: "0px",
                      lineHeight: "2rem",
                    }}
                  >
                    Welcome to TradePlace
                  </h1>
                  <table
                    align="center"
                    width="100%"
                    border="0"
                    cellPadding="0"
                    cellSpacing="0"
                    role="presentation"
                  >
                    <tbody>
                      <tr>
                        <td>
                          <table
                            align="center"
                            width="100%"
                            border="0"
                            cellPadding="0"
                            cellSpacing="0"
                            role="presentation"
                          >
                            <tbody style={{ width: "100%" }}>
                              <tr style={{ width: "100%" }}>
                                <p
                                  style={{
                                    fontSize: "1rem",
                                    lineHeight: "1.5rem",
                                    margin: "16px 0",
                                  }}
                                >
                                  Congratulations! You're joining a vibrant
                                  community of buyers and sellers at TradePlace.
                                  Here's how to get started:
                                </p>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <ul>
                    <li style={{ marginBottom: "20px" }}>
                      <p style={{ marginBottom: "20px" }}>
                        <strong>Explore our marketplace.</strong>{" "}
                        <a href="#" style={{ color: "#067df7" }}>
                          Browse through a wide range of products
                        </a>{" "}
                        from various vendors and find what you're looking for.
                      </p>
                    </li>
                    <li style={{ marginBottom: "20px" }}>
                      <p style={{ marginBottom: "20px" }}>
                        <strong>Manage your account.</strong> Access your
                        profile to update your details and track your orders.{" "}
                        <a href="#" style={{ color: "#067df7" }}>
                          Learn more about account management
                        </a>
                        .
                      </p>
                    </li>

                    <li style={{ marginBottom: "20px" }}>
                      <p style={{ marginBottom: "20px" }}>
                        <strong>Customize your shopping experience.</strong> Set
                        your preferences and receive personalized
                        recommendations.{" "}
                        <a href="#" style={{ color: "#067df7" }}>
                          Explore customization options
                        </a>
                        .
                      </p>
                    </li>

                    <li style={{ marginBottom: "20px" }}>
                      <p style={{ marginBottom: "20px" }}>
                        <strong>Get support.</strong> If you need any help, our
                        support team is here to assist you.{" "}
                        <a href="#" style={{ color: "#067df7" }}>
                          Contact support
                        </a>
                        .
                      </p>
                    </li>
                  </ul>
                  <table
                    align="center"
                    width="100%"
                    border="0"
                    cellPadding="0"
                    cellSpacing="0"
                    role="presentation"
                    style={{ textAlign: "center" }}
                  >
                    <tbody>
                      <tr>
                        <td>
                          <a
                            href="#"
                            style={{
                              backgroundColor: "rgb(34,80,244)",
                              color: "rgb(255,255,255)",
                              borderRadius: "0.5rem",
                              padding: "12px 18px",
                              lineHeight: "100%",
                              textDecoration: "none",
                              display: "inline-block",
                              maxWidth: "100%",
                            }}
                            target="_blank"
                          >
                            <span
                              style={{
                                maxWidth: "100%",
                                display: "inline-block",
                                lineHeight: "120%",
                              }}
                            >
                              Go to your dashboard
                            </span>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    align="center"
                    width="100%"
                    border="0"
                    cellPadding="0"
                    cellSpacing="0"
                    role="presentation"
                    style={{ marginTop: "45px" }}
                  ></table>
                </td>
              </tr>
            </tbody>
          </table>
          <table
            align="center"
            width="100%"
            border="0"
            cellPadding="0"
            cellSpacing="0"
            role="presentation"
            style={{ marginTop: "20px", maxWidth: "37.5em" }}
          >
            <tbody>
              <tr style={{ width: "100%" }}>
                <td>
                  <table
                    align="center"
                    width="100%"
                    border="0"
                    cellPadding="0"
                    cellSpacing="0"
                    role="presentation"
                  >
                    <tbody>
                      <tr>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    </>
  );
};
export const TradePlaceVerificationEmail = ({ verificationCode }) => {
    return (
      <html dir="ltr" lang="en">
        <head>
          <link
            rel="preload"
            as="image"
            href="https://tplace-orpin.vercel.app/img/logo.png"
          />
          <meta content="text/html; charset=UTF-8" />
          <meta name="x-apple-disable-message-reformatting" />
        </head>
        <body
          style={{
            backgroundColor: "rgb(250,251,251)",
            fontSize: "1rem",
            lineHeight: "1.5rem",
            fontFamily:
              'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
          }}
        >
          <img
            alt="TradePlace"
            height="75"
            src="https://tplace-orpin.vercel.app/img/logo.png"
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "20px",
              marginBottom: "20px",
              display: "block",
              outline: "none",
              border: "none",
              textDecoration: "none",
            }}
            width="184"
          />
          <table
            align="center"
            width="100%"
            border="0"
            cellPadding="0"
            cellSpacing="0"
            role="presentation"
            style={{
              backgroundColor: "rgb(255,255,255)",
              padding: "45px",
              maxWidth: "37.5em",
            }}
          >
            <tbody>
              <tr style={{ width: "100%" }}>
                <td>
                  <h1
                    style={{
                      textAlign: "center",
                      marginTop: "0px",
                      marginBottom: "0px",
                      lineHeight: "2rem",
                    }}
                  >
                    Verify Your Email Address
                  </h1>
                  <table
                    align="center"
                    width="100%"
                    border="0"
                    cellPadding="0"
                    cellSpacing="0"
                    role="presentation"
                  >
                    <tbody>
                      <tr>
                        <td>
                          <table
                            align="center"
                            width="100%"
                            border="0"
                            cellPadding="0"
                            cellSpacing="0"
                            role="presentation"
                          >
                            <tbody style={{ width: "100%" }}>
                              <tr style={{ width: "100%" }}>
                                <p
                                  style={{
                                    fontSize: "1rem",
                                    lineHeight: "1.5rem",
                                    margin: "16px 0",
                                  }}
                                >
                                  Thank you for signing up with TradePlace! To
                                  complete your registration, please use the
                                  following verification code:
                                </p>
                              </tr>
                              <tr>
                                <p
                                  style={{
                                    fontSize: "1.25rem",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    margin: "16px 0",
                                  }}
                                >
                                  {verificationCode}
                                </p>
                              </tr>
                              <tr>
                                <p
                                  style={{
                                    fontSize: "1rem",
                                    lineHeight: "1.5rem",
                                    margin: "16px 0",
                                  }}
                                >
                                  If you did not sign up for an account, please
                                  ignore this email. If you need help, our support
                                  team is here to assist you.
                                </p>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    align="center"
                    width="100%"
                    border="0"
                    cellPadding="0"
                    cellSpacing="0"
                    role="presentation"
                    style={{ textAlign: "center" }}
                  >
                    <tbody>
                      <tr>
                        <td>
                          <a
                            href="#"
                            style={{
                              backgroundColor: "rgb(34,80,244)",
                              color: "rgb(255,255,255)",
                              borderRadius: "0.5rem",
                              padding: "12px 18px",
                              lineHeight: "100%",
                              textDecoration: "none",
                              display: "inline-block",
                              maxWidth: "100%",
                            }}
                            target="_blank"
                          >
                            <span
                              style={{
                                maxWidth: "100%",
                                display: "inline-block",
                                lineHeight: "120%",
                              }}
                            >
                              Go to your dashboard
                            </span>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    align="center"
                    width="100%"
                    border="0"
                    cellPadding="0"
                    cellSpacing="0"
                    role="presentation"
                    style={{ marginTop: "45px" }}
                  ></table>
                </td>
              </tr>
            </tbody>
          </table>
          <table
            align="center"
            width="100%"
            border="0"
            cellPadding="0"
            cellSpacing="0"
            role="presentation"
            style={{ marginTop: "20px", maxWidth: "37.5em" }}
          >
            <tbody>
              <tr style={{ width: "100%" }}>
                <td>
                  <table
                    align="center"
                    width="100%"
                    border="0"
                    cellPadding="0"
                    cellSpacing="0"
                    role="presentation"
                  >
                    <tbody>
                      <tr>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    );
  };
 TradePlaceVerificationEmail;
export default TradePlaceWelcomeEmail;

