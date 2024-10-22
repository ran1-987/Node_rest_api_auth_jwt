import Datastore from 'nedb-promises';

const userRefreshTokens = Datastore.create({ filename: 'db/UserRefreshTokens.db', autoload: true });
const userInvalidTokens = Datastore.create({ filename: 'db/UserInvalidTokens.db', autoload: true });

export const TokenModel = {
    insertRefreshToken: async (token) => userRefreshTokens.insert(token),
    findRefreshToken: async (token) => userRefreshTokens.findOne(token),
    deleteRefreshToken: async (id) => userRefreshTokens.remove({ _id: id }),
    compactRefreshTokens: async () => userRefreshTokens.compactDatafile(),
    insertInvalidToken: async (token) => userInvalidTokens.insert(token),
    findInvalidToken: async (token) => userInvalidTokens.findOne({ accessToken: token }),
};
