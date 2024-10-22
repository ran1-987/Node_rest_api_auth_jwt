import Datastore from 'nedb-promises';

const users = Datastore.create({ filename: 'db/Users.db', autoload: true });

export const UserModel = {
    findByEmail: async (email) => users.findOne({ email }),
    findById: async (id) => users.findOne({ _id: id }),
    create: async (user) => users.insert(user),
};
