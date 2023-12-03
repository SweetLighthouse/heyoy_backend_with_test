export const checkParamValid = (data, [...param]) => {
    let array = Object.keys(data);
    let invalidElement = '';
    let isValid = true;
    if (param?.length > 0) {
        for (let i = 0; i < param.length; i++) {
            if (!array.includes(param[i])) {
                invalidElement = param[i];
                isValid = false;
                break;
            } else {
                let index = array.indexOf(param[i]);
                if (!data[array[index]]) {
                    invalidElement = param[i];
                    isValid = false;
                    break;
                }
            }
        }

        return {
            isValid,
            invalidElement,
        };
    }
    for (let i = 0; i < array.length; i++) {
        if (!data[array[i]]) {
            invalidElement = array[i];
            isValid = false;
            break;
        }
    }

    return {
        isValid,
        invalidElement,
    };
};

export const checkEmailValid = (email) => {
    const regex =
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    if (regex.test(email)) {
        return true;
    }
    return false;
};
