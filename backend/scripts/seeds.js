// Import the mongoose module
const mongoose = require("mongoose");

// Set up default mongoose connection
console.log(process.env.MONGODB_URI)
const mongoDB = process.env.MONGODB_URI
// const mongoDB = "mongodb://mongodb-node:27017/anythink-market";

const run = async () => {
    await mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

    // Get the default connection
    const db = mongoose.connection;

    // Bind connection to error event (to get notification of connection errors)
    db.on("error", console.error.bind(console, "MongoDB connection error: "));

    console.log('conencted: ', db.type)

    require("../models/User");
    require("../models/Item");
    require("../models/Comment");

    let users = await usersCreation(mongoose);
    let items = await itemsCreation(mongoose, users);
    await commentsCreation(mongoose, users, items);

    console.log("All done");
    mongoose.connection.close();
    // process.exitCode = 0;
    // process.exit(0);

}

const usersCreation = async(mongoose) => {
    var User = mongoose.model("User");
    await User.deleteMany();
    const users = [];
    for (let i = 1; i < 101; i++) {
        var user = new User();
        user.username = "user"+i;
        user.email = "user"+i+ "@em.xt";
        user.setPassword("pass"+i);
        // console.log('User: ', user);

        users.push((await user.save().then((res) => {
            // console.log(`Status: ${res.status}`);
            // console.log('Body: ', res);
            let token = res._id;
            console.log('usrId: ', token)
            return res
        }).catch((err) => {
            console.error(err);
        })));
    }
    return users;
}


const itemsCreation = async(mongoose, users) => {
    var Item = mongoose.model("Item");
    await Item.deleteMany();
    const itemIds = [];
    for (let i = 1; i < 101; i++) {
        var item = new Item();
        item.seller = users[0];
        item.slug = "sku"+i;
        item.title = "title"+i;
        // user.email = "user"+i+ "@em.xt";
        // user.setPassword("pass"+i);
        // console.log('Item: ', item);

        itemIds.push((await item.save().then((res) => {
            // console.log(`Status: ${res.status}`);
            // console.log('Body: ', res);
            let token = res._id;
            console.log('itemId: ', token)
            return token
        }).catch((err) => {
            console.error(err);
        })));
    }
    return itemIds;
}

const commentsCreation = async(mongoose, users, items) => {
    var Comment = mongoose.model("Comment");
    await Comment.deleteMany();
    const commentIds = [];
    for (let i = 1; i < 101; i++) {
        var comment = new Comment();
        comment.seller = users[0];
        comment.item = items[0];
        comment.body = "comment "+i;
        // user.email = "user"+i+ "@em.xt";
        // user.setPassword("pass"+i);
        // console.log('comment: ', comment);

        commentIds.push((await comment.save().then((res) => {
            let token = res._id;
            console.log('commentId: ', token)
            return token
        }).catch((err) => {
            console.error(err);
        })));
    }
    return commentIds;
}

// var status = run();
// console.log('status: ', status);

run()
.then(() => {
        process.exit();
    })
        .catch((err) => {
            console.error(err);
            process.exit();
        });



