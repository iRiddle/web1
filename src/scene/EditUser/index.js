import React from "react";
import PropTypes from "prop-types";
import { language } from "../../login/config/index";
import PersonalInformation from "../../components/PersonalInformation";

class EditUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = { userData: {} };
    }

    handleProfileUpdateData  = (id, value) => {
        console.log(id, value);
        const newData = Object.assign({}, this.state.userData);
        newData[id] = value;
        // make the api call with new data
    }

    render() {
        const preferredLanguage = this.props.userProfile.preferredLanguage === "en" ? "English" : "Spanish" || "English";
        const languageMap = JSON.parse(localStorage.getItem("languageMap"));
        const fields = [
            { label: "firstName", type: "input", mode: "view", width: "30%" },
            { label: "lastName", type: "input", mode: "view", width: "30%" },
            { label: "email",  type: "input", mode: "view", width: "30%" },
            { label: "primaryPhone", type: "phoneNo", width: "30%", mode: "view" },
            { label: "secondaryPhone", type: "phoneNo", width: "30%", mode: "edit" },
            { label: "country", type: "input", mode: "view", width: "30%" },
            { label: "preferredLanguage", type: "select", mode: "edit", width: "25%", options: language, placeholder: preferredLanguage }
        ];
        return (
            <div>
                <PersonalInformation
                    fields={fields}
                    userData={this.props.userData}
                    handlePersonalInformationInput={this.handleProfileUpdateData}
                    languageMap={languageMap}
                    mode="register"
                    inputDetails={{}}
                />
            <div onClick={this.handleProfileUpdateData}>Save</div>
            <div onClick={this.props.cancelAction}>Cancel</div>
            </div>
        )
    }
}

EditUser.propTypes = {
    userData: PropTypes.objectOf(PropTypes.object).isRequired,
    userProfile: PropTypes.objectOf(PropTypes.object),
    cancelAction:PropTypes.func.isRequired,
}

EditUser.defaultProps = {
    userProfile: {},
}

export default EditUser;