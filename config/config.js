module.exports.SEED = 'E:Be-d_G@aw1=';
module.exports.PAGINATE_LIMIT = 5;
module.exports.CLIENT_ID = '243517311864-ojvk7n07o6aoen1n3io8gmc29eggje5s.apps.googleusercontent.com';

const storageFolder = 'storage';
module.exports.STORAGE = {
    storageFolder: storageFolder,
    user: `./${ storageFolder }/users/`,
    hospital: `./${ storageFolder }/hospitals/`,
    doctor: `./${ storageFolder }/doctors/`,
};

const assetsFolder = 'assets';
module.exports.ASSETS = {
    assetsFolder: assetsFolder,
    noImg: `./${ assetsFolder }/no-img.jpg`
};
