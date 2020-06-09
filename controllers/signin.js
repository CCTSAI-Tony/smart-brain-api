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

// promise 的return 跟一般retrun 不一樣, 要注意!!
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
// promise chain 需要用then retrun連起來, or then =>
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
// 終於想通了, 若不return, db.select then 再呼叫db.select 若之後有then, 不管你nested db.select then 的下一步, 會直接執行下一個then
// 若無下一個then, 則會直接結束程式 promise status 直接resolved, promiseValue 為 undefined, 也就是說等不到nested promise的下一步call back function
// 前一個promise已結束

// 然而若加return 則是會等到nested db.select 執行完畢 才會進行下一個then 或結束程序


// Similarly, when we use a promise chaining, we need to return the promises.
// When we don’t return the promises, the consecutive then methods will not realise that
// it needs to wait for a promise in the sequence and simply assumes it as another line of code to be executed,
// there by losing its async nature.
// https://codeburst.io/playing-with-javascript-promises-a-comprehensive-approach-25ab752c78c3
