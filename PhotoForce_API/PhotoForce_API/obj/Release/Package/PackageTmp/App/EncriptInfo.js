function EncriptInfo(_0xfcf2x1) {
    var _0xfcf2x2 = new Date();
    var _0xfcf2x3 = "_" + (_0xfcf2x2["getDate"]() < 10 ? "0" + _0xfcf2x2["getDate"]() : _0xfcf2x2["getDate"]()) + "_" + (_0xfcf2x2["getMonth"]() + 1) + "_" + _0xfcf2x2["getFullYear"]();
    key = CryptoJS["enc"]["Utf8"]["parse"]("healthywayz_@_01_01_2025");
    iv = CryptoJS["enc"]["Utf8"]["parse"]("healthy_13112017");
    var _0xfcf2x4 = CryptoJS["AES"]["encrypt"](CryptoJS["enc"]["Utf8"]["parse"](_0xfcf2x1), key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS["mode"]["CBC"],
        padding: CryptoJS["pad"]["Pkcs7"]
    }).toString();
    return _0xfcf2x4
}