const handleSignin = (db, bcrypt) => (req, res) => {//advanced javascript func part
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');// retrun 後面的function並執行(), 離開整個function
  }
  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')  //nested promise 要用return 連起來
          .where('email', '=', email)
          .then(user => {
            res.json(user[0])//responding json
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
  handleSignin: handleSignin
}
// db.select from knex then return callback function, 因此若不return nested db.select, 裡面的call back function 不會被上層db.select執行

// knex select() returns a promise so that you can continue the flow within then() function.

// knex('projects').select('name').then(function(projectNames){
//     //do something here
//     console.log(projectNames);
// });

// why we need to put return on the nested db.select:
// 因為若不return, call back 的是 nested db.select 整個promise, 而不是nested db.select要call back的內容
// 等於上層db.selectn 完成搜索then => promise 做以下事情並結束
// 若沒retrun 就是promise 再做一次 db.select 結束, 裡面回傳的內容不care
// 若retrun, 則是retrun nested db.select 所要promise的內容
// promise 的return 跟一般retrun 不一樣, 要注意!!
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
// promise chain 需要用then retrun連起來, or then =>
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
// 終於想通了, 若不return, db.select then 再呼叫db.select 便結束handleSignin 這個function, 不管你nested db.select then 的下一步
// 然而若加return 則是會等到nested db.select then 的下一步
