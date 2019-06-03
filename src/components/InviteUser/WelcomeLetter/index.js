import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
//import letterEnglish from "../../../../assets/images/letter.png";
//import letterSpanish from "../../../../assets/images/letter-spanish.png";
import English from '../../../login/config/language/english';
import Spanish from '../../../login/config/language/spanish';

class WelcomeLetter extends React.Component {

  state={
    languageMap: ""
  };

  componentDidMount(){
    this.getLanguageMap();
  }

  getLanguageMap() {
    const { preferredLanguage } = this.props
    let languageMap = preferredLanguage === "Spanish" ? Spanish : English;
    this.setState({ languageMap })
  }

  render() {
    const { preferredLanguage, open, handleClose, personalInformation } = this.props;
    const{ languageMap }= this.state
    return (
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          scroll={"paper"}
          aria-labelledby="scroll-dialog-title"
        >
          <DialogContent>
            {/* <img
              style={{ width: "100%" }}
              src={
                preferredLanguage == "English" ? letterEnglish : letterSpanish
              } */}

            <div style={{ backgroundColor: "#fdda24", margin: 0 }}>
              <table
                style={{
                  fontFamily:
                    '"Proxima Nova" , "Century Gothic" , Arial , Verdana , sans-serif',
                  fontSize: "14.0px",
                  color: "#5e5e5e",
                  width: "100.0%",
                  maxWidth: "600.0px",
                  float: "none",
                  margin: "0 auto"
                }}
                border={0}
                cellSpacing={0}
                cellPadding={0}
                align="left"
              >
                <tbody>
                  <tr style={{ height: 70 }} align="middle">
                    <td style={{ paddingTop: 30, paddingBottom: 32, height: 53 }}>
                      {/* <img
                        src="https://drive.google.com/open?id=1oGUGTPY196XVQyl31d_5F2q0PqrskdsL"
                        alt
                      /> */}
                      <img
                        src="https://s3.us-east-2.amazonaws.com/gpastaticfiles/eng-banner.jpg"
                        alt
                        width={495}
                        height={99}
                      />
                    </td>
                  </tr>
                  <tr style={{ height: 715 }} align="middle">
                    <td style={{ height: 715 }}>
                      <table
                        style={{
                          width: "90.0%",
                          lineHeight: "20.0px",
                          paddingLeft: 32,
                          paddingRight: 32,
                          border: "1.0px solid",
                          borderColor: "#f0f0f0"
                        }}
                        cellPadding={0}
                        bgcolor="#ffffff"
                      >
                        <tbody>
                          <tr>
                            <td
                              style={{
                                color: "#5e5e5e",
                                fontSize: 22,
                                lineHeight: 2,
                                textAlign: "center"
                                }}
                            >
                              {languageMap.welcomeMessage}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                paddingTop: "24.0px",
                                verticalAlign: "bottom"
                              }}
                            >
                              {languageMap.hi} {this.props.personalInformation.firstName},
                            </td>
                          </tr>
                          <tr>
                            <td style={{ paddingTop: "24.0px" }}>
                              <div>
                                {languageMap.bodyMessage}
                              </div>
                              <div>&nbsp;</div>
                              <p>
                                <a
                                  style={{
                                    color: "#007dc1",
                                    textDecoration: "none"
                                  }} 
                                >
                                  {languageMap.videoLink}
                                </a>
                              </p>
                              <div>&nbsp;</div>
                              <div>
                                {languageMap.info}
                              </div>
                              <div>
                                <div>
                                  Name:&nbsp;<strong
                                    style={{ backgroundColor: "#fafafa" }}
                                  >
                                    {this.props.personalInformation.firstName}
                                  </strong>
                                </div>
                                <div>
                                  Email:&nbsp;<strong
                                    style={{ backgroundColor: "#fafafa" }}
                                  >
                                    {this.props.personalInformation.email}
                                  </strong>
                                </div>
                              </div>
                              <br />
                              <div>
                                {languageMap.moreInfo}
                              </div>
                              <div>&nbsp;</div>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ paddingTop: "24.0px" }}>&nbsp;</td>
                          </tr>
                          <tr>
                            <td align="center">
                              <table border={0} cellSpacing={0} cellPadding={0}>
                                <tbody>
                                  <tr>
                                    <td
                                      style={{
                                        height: "39.0px",
                                        paddingBottom: "8.0px"
                                      }}
                                      align="center"
                                    >
                                      <a
                                        id="reset-password-link"
                                        style={{ textDecoration: "none" }}                                       
                                      >
                                        <span
                                          style={{
                                            display: "block",
                                            padding: "9.0px 32.0px 7.0px 31.0px",
                                            border: "1.0px solid",
                                            textAlign: "center",
                                            cursor: "pointer",
                                            color: "#ffffff",
                                            borderRadius: "3.0px",
                                            backgroundColor: "#44bc98",
                                            borderColor:
                                              "#328c71 #328c71 #2f856b",
                                            boxShadow: "#d8d8d8 0 1.0px 0"
                                          }}
                                        >
                                          {languageMap.activateButtonText}
                                        </span>
                                      </a>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{ color: "#999999" }}
                                      align="center"
                                    >
                                      {languageMap.linkExpire}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ paddingTop: "24.0px" }}>
                              Your username is{" "}
                              <strong>
                                {this.props.personalInformation.email}
                              </strong>{" "}
                              <br />Your organization's sign-in page is{" "}
                              <a
                                style={{
                                  color: "#007dc1",
                                  textDecoration: "none"
                                }}                          
                              >
                                <span
                                  style={{
                                    color: "#007dc1",
                                    textDecoration: "none"
                                  }}
                                >
                                  https://dev-67523.oktapreview.com
                                </span>
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ paddingTop: "24.0px", paddingBottom: "24.0px" }}>
                              {languageMap.difficultyText}
                              <a
                                style={{
                                  color: "#007dc1",
                                  textDecoration: "none"
                                }}                                
                              >
                                <span
                                  style={{
                                    color: "#007dc1",
                                    textDecoration: "none"
                                  }}
                                >
                                  https://dev-67523.oktapreview.com/help/login
                                </span>
                              </a>
                            </td>
                          </tr>                        
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr style={{ height: 15 }}>
                    <td
                      style={{
                        fontSize: 12,
                        padding: "16px 0px 30px 50px",
                        color: "#999999",
                        height: 15
                      }}
                    >
                      This is an automatically generated message for
                      <a
                        style={{ color: "#616161" }}
                      >
                        driscolls
                      </a>. Replies are not monitored or answered.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}


export default WelcomeLetter;

