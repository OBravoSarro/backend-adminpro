module.exports.SEED = 'E:Be-d_G@aw1=';
module.exports.PAGINATE_LIMIT = 5;

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