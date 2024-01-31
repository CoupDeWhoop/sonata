const { v4: uuidv4 } = require('uuid');

exports.generateUserUUIDs = (userData) => {
    return userData.map(user => ({
        ...user,
        user_id: uuidv4() // Generate UUID for each user
    }));
};

exports.createRef = (arr, key, value) => {
    return arr.reduce((ref, element) => {
        ref[element[key]] = element[value];
        return ref;
    }, {});
};

exports.replaceKeyWithId = (data, idLookup, key) => {
    //extracts key as "name" 
    return data.map(({ [key]: name, ...restOfData}) => {
        const user_id = idLookup[name];
        return {
            user_id,
            ...restOfData
        };
    });
};

