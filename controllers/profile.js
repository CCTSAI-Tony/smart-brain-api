const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})//es6 syntax cause property and value are the same or {id = id}
    .then(user => {
      if (user.length) {
        res.json(user[0])//why user[0], [user] => user, 想回傳object而不是array
      } else { //javascript Boolean([]) => true
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
}

module.exports = {//es6 syntex
  handleProfileGet
}

//we don't use this feature in this project
