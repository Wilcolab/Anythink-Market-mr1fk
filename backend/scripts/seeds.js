const axios = require('axios');

const configUsers = {
    headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json"
    }
};

let port = 27017

const usersCreation = async() => {
    const usersTokens = [];
    for (let step = 1; step < 101; step++) {

        const data = {
            "user": {"email": "userZZ" + step + "@user.gg", "password": "user" + step, "username": "userZZ" + step}
        };

        usersTokens.push(await axios.post('http://localhost:'+port+'/api/users', data, configUsers)
            .then((res) => {
                console.log(`Status: ${res.status}`);
                console.log('Body: ', res.data);
                let token = res.data.user.token;
                console.log('userToken: ', token)
                return token
            }).catch((err) => {
            console.error(err);
        }));
    }
    return usersTokens;
}



usersCreation().then((userTokens) => {

    let userToken = userTokens[0];
    console.log('userToken ', userToken);

    const config = {
        headers:{
            Authorization: "Token " + userToken,
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json"
        }
    };

    // itemsCreation(config);
    itemsCreation(config).then((items) => {

    let newItem = items[0];
    console.log('newItem ', newItem);
    comments(config, newItem);
});

});


const itemsCreation = async(config) => {
    const itemSlugs = [];
    for (let step = 1; step < 101; step++) {
        const data = {
            item: {
                title: 'Itemx_' + step,
                description: 'Desc Item_' + step
            }
        };

        itemSlugs.push(await axios.post('http://localhost:'+port+'/api/items', data, config)
            .then((res) => {
                console.log(`Status: ${res.status}`);
                console.log('Body: ', res.data);
                let slug = res.data.item.slug
                console.log('Slug: ', slug)
                // itemSlugs.push(slug);
                console.log(itemSlugs)
                return slug
            }).catch((err) => {
            console.error(err);
        }));

    }
    return itemSlugs;
}



const comments = async(config, itemId) => {
    const responses = [];
    for (let step = 1; step < 101; step++) {
        const data = {
            comment: {
                body: 'comment_' + step
            }
        };

        responses.push(await axios.post('http://localhost:'+port+'/api/items/' + itemId + '/comments', data, config)
            .then((res) => {
                console.log(`Status: ${res.status}`);
                console.log('Body: ', res.data);
                console.log('itemId: ', itemId);
            }).catch((err) => {
                console.error(err);
            }));


    }
}







