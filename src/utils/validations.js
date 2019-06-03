import validator from "validator";

const required = value => {
  if (!value.toString().trim().length) {
    // We can return string or jsx as the 'error' prop for the validated Component
    return "This field is required";
  }
};

const lettersOnly = value => {
  const val = value.match(/[a-zA-Z\s]*$/);
  if (!Boolean(val)) {
    // components['password'][0].value !== components['confirm'][0].value
    // 'confirm' - name of input
    // components['confirm'] - array of same-name components because of checkboxes and radios
    return "This field must only consist of letters.";
  }
};

// email validations.

const email = value => {
  if (!validator.isEmail(value)) {
    return `${value} is not a valid email.`;
  }
};

const driscollsEmail = value => {
  const val = value.match(/^.*@driscolls\.com/);
  if (!Boolean(val)) {
    return "Email must be Driscolls.";
  }
};

const nonDriscollsEmail = value => {
  const val = value.match(/^.*@driscolls\.com/);
  if (Boolean(val)) {
    return "Email cannot be Driscolls.";
  }
};

//alphanumeric value check

const alphaNumeric = value => {
  const val = value.match(/[a-zA-Z0-9\s]*$/);
  if (!Boolean(val)) {
    return `This field must only consist of letters and numbers.`;
  }
};

const maxlen = (value, props) => {
  // get the maxLength from component's props
  if (value.toString().trim().length > 25) {
    // Return jsx
    return `Only 25 characters is allowed for this field`;
  }
};

const password = (value, props, components) => {
  // NOTE: Tricky place. The 'value' argument is always current component's value.
  // So in case we're 'changing' let's say 'password' component - we'll compare it's value with 'confirm' value.
  // But if we're changing 'confirm' component - the condition will always be true
  // If we need to always compare own values - replace 'value' with components.password[0].value and make some magic with error rendering.
  if (value !== components["confirm"][0].value) {
    // components['password'][0].value !== components['confirm'][0].value
    // 'confirm' - name of input
    // components['confirm'] - array of same-name components because of checkboxes and radios
    return <span className="error">Passwords are not equal.</span>;
  }
};

export {
  required,
  email,
  maxlen,
  lettersOnly,
  password,
  alphaNumeric,
  driscollsEmail,
  nonDriscollsEmail
};
