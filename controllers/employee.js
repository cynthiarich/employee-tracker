const orm = require("../config/orm");

const employee = {
    getNew: reinit => {
        //get the list of roles
        orm.some("roles", ["roleid", "title"], cb => {
            //prompt for employee details
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
                    type: 'confirm',
                    message: 'Is this employee a manager?',
                    name: 'is_manager'
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
                orm.find("employees", "is_manager", true, cb => {
                    inquirer.prompt({
                        type: "list",
                        message: "Choose this employee's manager from the list:",
                        name: "manager",
                        choices: () => {
                            let mlist = cb.map(obj => `${obj.employeeid}: ${obj.first_name} ${obj.last_name}`);
                            return mlist;
                        }
                    }).then(mgr => {
                        const { first_name, last_name, is_manager, role } = answers;
                        const { manager } = mgr;
                        role.split(":");
                        const roleInput = role[0];
                        manager.split(":");
                        const mgrInput = manager[0];
                        orm.create("employees", ["first_name", "last_name", "is_manager", "roleid", "managerid"], [first_name, last_name, is_manager, roleInput, mgrInput], cb => {
                            console.log(`=============== New Employee Created ============`);
                            console.log(cb);
                            reinit(cb);
                        })
                    })
                })
            });
        });
    },

    update: reinit => {
        //update employee
    },

    remove: reinit => {
        //remove employee
    }
} 
        
module.exports = employee;