module.exports.validateRegisterInput = (
    firstName,
    lastName,
    zipCode,
    email,
    password
) => {
    const errors = {};
    if(firstName.trim() === ''){
        errors.firstName = 'First name must not be empty';
    }
    if(lastName.trim() === ''){
        errors.lastName = 'Last name must not be empty';
    }
    if(zipCode.trim() === ''){
        errors.zipCode = 'Zip code must not be empty';
    } else{
        const regEx = /^[0-9]{5}(?:-[0-9]{4})?$/;
        if(!zipCode.match(regEx)){
            errors.zipCode = 'Zipcode must be a valid zipcode';
        }
    }
    if(email.trim() === ''){
        errors.email = 'Email name must not be empty';
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if(!email.match(regEx)){
            errors.email = 'Email must be a valid email address';
        }
    }
    if(password === ''){
        errors.password = 'Password must not be empty'
    } else {
        const regEx = /^.{8,}$/
        if(!password.match(regEx)){
            errors.password = 'Password must be at least 8 characters in length'
        }
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
}

module.exports.validateLoginInput = (
    email,
    password
) => {
    const errors = {};
    if(email.trim() === ''){
        errors.email = 'Email must not be empty';
    }
    if(password === ''){
        errors.password = 'Password must not be empty'
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
}

module.exports.validateZipCode = (
    email,
    zipCode
) => {
    const errors = {};

    if(email.trim() === ''){
        errors.email = 'Email must not be empty';
    }

    if(zipCode.trim() === ''){
        errors.zipCode = 'Zip code must not be empty';
    } else{
        const regEx = /^[0-9]{5}(?:-[0-9]{4})?$/;
        if(!zipCode.match(regEx)){
            errors.zipCode = 'Zipcode must be a valid zipcode';
        }
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
}