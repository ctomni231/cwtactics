// (any) -> boolean
cwt.isInteger = (value) => typeof value === 'number' && value % 1 === 0;

// (any) -> boolean
cwt.isNumber = (value) => typeof value === 'number';

// (any) -> boolean
cwt.isString = (value) => typeof value === 'string';

// (any) -> boolean
cwt.isFunction = (value) => typeof value === 'function';

// (any) -> boolean
cwt.isBoolean = (value) => value === true || value === false;

// (any) -> boolean
cwt.isSomething = (value) => value !== null && value !== undefined;

// (list<any>, (any) -> boolean) -> boolean
cwt.isListOf = (value, valueTypeCheck) => value.every(element => valueTypeCheck(element));

// (map<any>, (any) -> boolean) -> boolean
cwt.isMapOf = (value, valueTypeCheck) => Object.keys(value).every(key => valueTypeCheck(value[key]));
