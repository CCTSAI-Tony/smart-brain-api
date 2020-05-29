const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;//back end does its own validation, same as front end
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');//don't forget to put return here
  }
  const hash = bcrypt.hashSync(password);//synchronous
    db.transaction(trx => {//db.transaction to use when deal with mutiple operatons on a db when one fails everthing fails
      trx.insert({ //trx instead of db to implement multiple transaction operations
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')//return insert 這一筆的 的 email collumn
      .then(loginEmail => {//update the login table return loginEmail then update the users table
        return trx('users') //retrun data from data base
          .returning('*')//return all collumns(after insert)
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);//why user[0], [user] => user, 想回傳object而不是array
          })
      })
      .then(trx.commit)// remember to commit to all operations to store the data
      .catch(trx.rollback)//if everythins fail, rollback the action
    })
    .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
  handleRegister: handleRegister
};
