var connection = require("./connection.js");

function printQuestionMarks(num) {
    let arr = [];

    for (var i = 0; i < num; i++) {
        arr.push("?");
    }

    return arr.toString();
}

function objToSql(ob) {
    let arr = [];

    // loop through the keys and push the key/value as a string int arr
    for (var key in ob) {
        let value = ob[key];
        // check to skip hidden properties
        if (Object.hasOwnProperty.call(ob, key)) {
            if (typeof value === "string" && value.indexOf(" ") >= 0) {
                value = "'" + value + "'";
            }
            arr.push(key + "=" + value);
        }
    }

    // translate array of strings to a single comma-separated string
    return arr.toString();
}

const orm = {
    all: (table, cb) => {
        let queryString = "SELECT * FROM " + table + ";";
        connection.query(queryString, (err, result) => {
            if (err) throw (err);
            cb(result);
        });
    },

    some: (table, cols, cb) => {
        let queryString = "SELECT " + cols.toString() + " FROM " + table + ";";
        connection.query(queryString, (err, result) => {
            if (err) throw (err);
            cb(result);
        })
    },

    create: (table, cols, vals, cb) => {
        let queryString = "INSERT INTO " + table;
        queryString += " (";
        queryString += cols.toString();
        queryString += ") ";
        queryString += "VALUES (";
        queryString += printQuestionMarks(vals.length);
        queryString += ")";

        connection.query(queryString, vals, (err, result) => {
            if (err) throw err;
            cb(result);
        });
    },

    update: (table, objColVals, condition, cb) => {
        let queryString = "UPDATE " + table;

        queryString += " SET ";
        queryString += objToSql(objColVals);
        queryString += " WHERE ";
        queryString += condition;

        console.log(queryString);
        connection.query(queryString, function (err, result) {
            if (err) {
                throw err;
            }

            cb(result);
        });
    },

    delete: (table, id, val, cb) => {
        let queryString = "DELETE FROM " + table;
        queryString += " WHERE ";
        queryString += id + "=";
        queryString += val;

        connection.query(queryString, (err, result) => {
            if (err) throw err;

            cb(result);
        });
    }
};

module.exports = orm;