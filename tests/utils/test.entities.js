// This module contains classes of static entities for use during testing

class warehouse {
    static json = {
        //id: -1
        description: 'LYIT',
        address1: 'Institiúid Teicneolaíochta Leitir Ceanainn',
        addressCounty: 'Dhún na nGall',
        addressCountry: 'Ireland',
        postcode: 'F92FC93'
    };
    static correctPostcode = 'Éire';
    static errorID = 9999999999;
    static errorDescription = 'Testing cannot PUT this anywhere';
    static correctDescription = 'Testing PUT this here';
}

class binLocation {
    static json = {
        //id: -1
        description: 'LYIT BinLocation',
        aisle: "A1",
        shelf: "4"
        //warehouse:{}
    };
    static correctShelf = '2';
    static errorID = 9999999999;
    static errorDescription = 'Testing cannot PUT this anywhere';
    static correctDescription = 'Testing PUT this here';
}

class stockItem {
    static json = {
        description: 'LYIT StockItem',
        ean: '012345678905',
        upc: '0012345678905'
    };
    static correctEan = '210987654321';
    static correctUpc = '954231385444';
    static errorID = 9999999999;
    static errorDescription = 'Testing cannot PUT this anywhere';
    static correctDescription = 'Testing PUT this here';

}

module.exports = {
    warehouse,
    binLocation,
    stockItem
};