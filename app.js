const cTable = require('console.table');
const inquirer = require('inquirer');
const joi = require("@hapi/joi");
const orm = require("./config/orm");
const employee = require("./controllers/employee");
const role = require("./controllers/role");
const manager = require("./controllers/manager");
const department = require("./controllers/department");


//initialize the app
function init() {
    //find out which action they would like to perform 
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
        //route user to appropriate function
        const { action } = data;
        if (action === "View") {
            getView();
        }
        else if (action === "Add" || action === "Update" || action === "Remove") {
            //find out which model they want to take action on
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
                        employee.getNew(init());
                    }
                    else if (option === "Role") {
                        role.getNew(init());
                    }
                    else if (option === "Department") {
                        department.getNew(init());
                    }
                }
                else if (action === "Update") {
                    if (option === "Employee") {
                        employee.update(init());
                    }
                    else if (option === "Role") {
                        role.update(init());
                    }
                    else if (option === "Department") {
                        department.update(init());
                    }
                }
                else if (action === "Remove") {
                    if (option === "Employee") {
                        employee.remove(init());
                    }
                    else if (option === "Role") {
                        role.remove(init());
                    }
                    else if (option === "Department") {
                        department.remove(init());
                    }
                }
            });
        }
        else if (action === "Exit") {
            process.exit();
        }
    });
};


function getView() {
    //find out which dataset they want to view
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
            //display all employees, roles, or departments based on selection
            orm.all(viewOption[1], cb => {
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
            //find out which department, role, or manager
            inquirer.prompt(
                {
                    type: 'input',
                    message: `Which ${viewOption[2]} would you like to view? (Type "List" for available options)`,
                    name: 'selection',
                    validate: value => {
                        //does this record exist?
                        orm.find(`${viewOption[2]}s`, value, cb => {
                            console.log("=========== Does record exist? ========");
                            console.log(cb);
                        })

                    }
                }
            ).then(answer =>
            if (viewOption[2] === "department"){
                //get list of all departments
            } else if (viewOption[2] === "role") {
                //get list of all roles
            }
            //inquirer prompt to get selection

            orm.allby("employees", viewOption[2], cb => {
                console.log(`=============== All ${viewOption[2]} employees ===========`)
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