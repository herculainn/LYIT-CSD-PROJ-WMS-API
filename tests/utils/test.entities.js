// This module contains classes of static entities for use during testing

// TODO: DELETE THIS MODULE!!

class binLocation {
    static json = {
        //id: -1
        description: 'LYIT BinLocation',
        aisle: "AISLE0001",
        shelf: "SHELF0001"
        //warehouse:{}
    };
    static correctShelf = 'SHELF0002';
    static errorID = 9999999999;
    static errorDescription = 'Testing cannot PUT this anywhere';
    static correctDescription = 'Testing PUT this here';
}

class stockItem {
    static json = {
        description: 'NVIDIA GeForce RTX 3080 Graphics Card',
        ean: '0812674024509',
        upc: '812674024509'
    };
    static correctEan = '210987654321';
    static correctUpc = '954231385444';
    static errorID = 9999999999;
    static errorDescription = 'Testing cannot PUT this anywhere';
    static correctDescription = 'Testing PUT this here';

}

module.exports = {
    binLocation,
    stockItem
};