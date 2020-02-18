const cTable = require('console.table');
const inquirer = require('inquirer');
const joi = require("@hapi/joi");
const orm = require("./config/orm")

function init() {

    inquirer.prompt(
        {
            type: "list",
            message: "Which action would you like to perform?",
            name: "action",
            choices: [
                "View",
                "Add",
                "Update",
                "Remove",
                "Exit"
            ],
            validate: validateArr
        }
    ).then(data => {
        const { action } = data;
        if (action === "View") {
            getView();
        }
        else if (action === "Add" || action === "Update" || action === "Remove") {
            inquirer.prompt(
                {
                    type: 'list',
                    message: `What would you like to ${action.toLowerCase()}?`,
                    name: 'option',
                    choices: [
                        "Employee",
                        "Role",
                        "Department"
                    ],
                    validate: validateArr
                }
            ).then(data => {
                const { option } = data;
                if (action === "Add") {
                    if (option === "Employee") {
                        getNewEmployee();
                    }
                    else if (option === "Role") {
                        getNewRole();
                    }
                    else if (option === "Department") {
                        getNewDepartment();
                    }
                }
                else if (action === "Update") {
                    if (option === "Employee") {
                        updateEmployee();
                    }
                    else if (option === "Role") {
                        updateRole();
                    }
                    else if (option === "Department") {
                        updateDepartment();
                    }
                }
                else if (action === "Remove") {
                    getRemove(option);
                }
            });
        }
        else if (action === "Exit") {
            process.exit();
        }
    });
};


function getView() {
    const viewChoices = [
        "All employees",
        "Employee details",
        "Employees by department",
        "Employees by role",
        "Employees by manager",
        "All roles",
        "Roles by department",
        "All departments",
        "Total budget for a department"
    ]
    inquirer.prompt(
        {
            type: 'list',
            message: 'Which list would you like to view?',
            name: 'viewOption',
            choices: viewChoices,
            validate: validateArr
        }
    ).then(answer => {
        const { viewOption } = answer;
        viewOption.split(" ");
        if (viewOption[0] === "All"){
            orm.all(viewOption, cb => {
                console.log(`================= All ${viewOption} ==================`)
                console.table(cb);
            })
        }
        else if (viewOption[1] === "details") {
            //show details for a single employee
            //include role title, salary
            //include manager title
            //include department
        }
        else if (viewOption[0] === "Employees") {
            //all employees by department
            //all employees by role
            //all employees by manager
        }
        else if (viewOption[0] === "Roles") {
            //all roles by department
        }
        else if (viewOption[0] === "Total") {
            //total budget for a department
        }
    });
};

function getNewEmployee() {
    orm.some("roles", ["roleid", "title"], cb => {
        inquirer.prompt([
            {
                type: 'input',
                message: 'Employee first name:',
                name: 'first_name'
            },
            {
                type: 'input',
                message: 'Employee last name:',
                name: 'last_name'
            },
            {
                type: "list",
                message: "Choose the role from the list:",
                name: "role",
                choices: () => {
                    let rlist = cb.map(obj => `${obj.roleid}: ${obj.title}`);
                    return rlist;
                }
            }
        ]).then(answers => {
            orm.some("employees", ["employeeid", "first_name", "last_name"], cb => {
                inquirer.prompt({
                    type: "list",
                    message: "Choose the manager from the list:",
                    name: "manager",
                    choices: () => {
                        let mlist = cb.map(obj => `${obj.employeeid}: ${obj.first_name} ${obj.last_name}`);
                        return mlist;
                    }
                }).then(mgr => {
                    const { first_name, last_name, role } = answers;
                    const { manager } = mgr;
                    role.split(":");
                    const roleInput = role[0];
                    manager.split(":");
                    const mgrInput = manager[0];
                    orm.create("employees", ["first_name", "last_name", "roleid", "managerid"], [first_name, last_name, roleInput, mgrInput], cb => {
                        console.log(cb);
                        init();
                    })
                })
            })
        });
    });
}

function getRemove(option) {
    orm.all(`${option.toLowerCase()}s`, cb => {
        inquirer.prompt({
            type: 'list',
            message: `Which ${option} would you like to remove?`,
            name: "selected",
            choices: () => {
                let slist = [];
                if (option === "Employee") {
                    slist = cb.map(obj => `${obj.employeeid}: ${obj.first_name} ${obj.last_name}`);
                }
                else if (option === "Role") {
                    slist = cb.map(obj => `${obj.roleid}: ${obj.title}`);  
                }
                else if (option === "Department") {
                    slist = cb.map(obj => `${obj.departmentid}: ${obj.department_name}`);  
                }
                return slist;
            }
        }).then(answer => {
            const { selected } = answer;
            selected.split(":");
            const delValue = selected[0];
            orm.delete(`${option.toLowerCase()}s`, `${option.toLowerCase()}id`, delValue, cb => {
                console.log(cb);
                init();
            })
        })
    })
}


//Role, add
//choose department
//Department, add

function getUpdate(option) {

    //Employee, update
    //choose role
    //choose manager
    //Role, update
    //choose department
    //Department, update
}

function onValidation(err, val) {
    if (err) {
        console.log(err.message);
        valid = err.message;
    }
    else {
        valid = true;
    }

    return valid;
};

function validateArr(ops) {
    return joi.validate(ops, joi.array().min(1), onValidation);
};

init();

