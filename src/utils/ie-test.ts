export function  getIEVersion() {
    let version = -1;
    if (navigator) {
        const userAgent = navigator.userAgent;
        const regEx = new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})');
        if (regEx.exec(userAgent) != null) {
            version = parseFloat(RegExp.$1);
        }
    }
    return version;
}

export function  getTridentVersion() {
    let version = -1;
    if (navigator) {
        const userAgent = navigator.userAgent;
        const regEx = new RegExp('Trident/([0-9]{1,}[\.0-9]{0,})');
        if (regEx.exec(userAgent) != null) {
            version = parseFloat(RegExp.$1);
        }
    }
    return version;
}
