require('dotenv').config();
class User {
    constructor(obj) {
            this.obj = obj;
        }
        // Getter
    get data() {
        const user = this.obj;
        const userObject = {...user };
        delete userObject.password;

        return userObject;
    }
}

// Genarate random chars foe varification send code
const GenarateRandom = () => {
    let chars = process.env.SECRET_CHARS;
    let rand = "";
    for (let i = 6; i > 0; --i) {
        rand += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return rand;
}

const CreatQuery = (table, cols) => {
    // beginning of update query
    let query = ['INSERT INTO'];
    query.push(table);
    query.push('(');
    // assigning a number value for parameterized query
    let set1 = [];
    Object.keys(cols).map(function(key) {
        set1.push(key);
    });
    query.push(set1.join(', '));
    query.push(') VALUES (');
    let set2 = [];
    Object.keys(cols).forEach(function(key, i) {
        set2.push('$' + (i + 1));
    });
    query.push(set2.join(', '));
    query.push(')');
    query.push('RETURNING id;');
    return query.join(' ');
}

const SelectQuerytable = (table, cols) => {
    // beginning of select query
    let query = ['SELECT * FROM'];
    query.push(table);
    query.push('WHERE');
    // assigning a number value for parameterized query
    let set = [];
    Object.keys(cols).forEach(function(key, i) {
        set.push(key + ' = $' + (i + 1));
    });

    query.push(set.join(' AND '));
    // Return a complete query string

    return query.join(' ');

}

const DeletQuerytable = (table, cols) => {
    // beginning of select query
    let query = ['DELETE FROM'];
    query.push(table);
    query.push('WHERE');
    // assigning a number value for parameterized query
    let set = [];
    Object.keys(cols).forEach(function(key, i) {
        set.push(key + ' = $' + (i + 1));
    });

    query.push(set.join(' AND '));
    // Return a complete query string

    return query.join(' ');

}


const UpdateQuerytable = (table, id, cols) => {
    // beginning of update query
    let query = ['UPDATE'];
    query.push(table);
    query.push('SET');
    // assigning a number value for parameterized query
    let set = [];
    Object.keys(cols).forEach(function(key, i) {
        set.push(key + ' = ($' + (i + 1) + ')');
    });
    query.push(set.join(', '));
    query.push('WHERE id = ' + id);
    // Return a complete query string
    return query.join(' ');
}

function getCallerIP(request) {
    var ip = request.headers['x-forwarded-for'] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;
    ip = ip.split(',')[0];
    ip = ip.split(':').slice(-1); //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"
    return ip;
}

function getCallerPort(request) {
    var port =
        request.connection.remotePort ||
        request.socket.remotePort ||
        request.connection.socket.remotePort;

    return port;
}

module.exports = {
    User,
    GenarateRandom,
    UpdateQuerytable,
    SelectQuerytable,
    CreatQuery,
    getCallerIP,
    getCallerPort,
    DeletQuerytable
}