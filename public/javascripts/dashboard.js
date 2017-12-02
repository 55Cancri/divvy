window.addEventListener('load', () => {


  let accountListItems = [].slice.call(document.querySelectorAll('.account'))

  let accountEditItems = [].slice.call(document.querySelectorAll('.edit'))

  // accountListItems.forEach(function(item, index) {
  //   item.addEventListener('mouseover', function() {
  //     item.classList.remove('turn-white')
  //     item.classList.add('turn-grey')
  //     accountEditItems[index].classList.remove('hidden')
  //     accountEditItems[index].classList.remove('fade-out')
  //     accountEditItems[index].classList.add('fade-in')
  //   })

  //   item.addEventListener('mouseleave', function() {
  //     item.classList.add('turn-white')
  //     item.classList.remove('turn-grey')
  //     accountEditItems[index].classList.add('hidden')
  //     accountEditItems[index].classList.add('fade-out')
  //     accountEditItems[index].classList.remove('fade-in')
  //   })
  // })



  // handle new income total
  let dispense = document.querySelector('.input-divvy')
  let infusionAmount = document.querySelector('.injection-value')
  let infusionSubmitButton = document.querySelector('.dispenser')
  let dynamicCashTotal = document.querySelector('.total-number')


  function animateResultCount(curr, target, elem) {
    if(curr < target) {
      let interval = setInterval(function() {
        elem.textContent = "$" + numberWithCommas(curr)
        if (curr >= target) {
          clearInterval(interval)
          return
        }
        curr++
    }, 1)
}
if(target < curr) {
    let interval = setInterval(function() {
        elem.textContent = "$" + numberWithCommas(curr)
        if (target >= curr) {
          clearInterval(interval)
          return
        }
        curr--
      }, 1)
    }
  }


  function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  function checkLength() {
    if ((infusionAmount.value.length < 1) || (infusionAmount == "")) {
      infusionSubmitButton.disabled = true
    } else {
      infusionSubmitButton.disabled = false
    }
  }
  checkLength()

  dispense.addEventListener('input', checkLength)

  dispense.addEventListener('submit', (e) => {
    e.preventDefault()

    // local_data was a variable passed in on dashboard pug template that came from dashboard route in express. It is the whole req.user object.
    fetch('/funds/infusions', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: infusionAmount.value,
        user: local_data
      })
    })
    .then(res => {
      return res.text()
    })
    .then(data => {
      parsedData = JSON.parse(data)
      console.log("Infusion from server: ", parsedData.infusions[parsedData.infusions.length - 1])
      console.log("Accounts :", parsedData.accounts)

      let newCashTotal = parsedData.accounts.reduce(function(total, item) { return total + item.amount }, 0)

      let shaveDynamicCashTotal = parseFloat(dynamicCashTotal.textContent.replace(/[^0-9\.]+/g,""))

      if (newCashTotal - shaveDynamicCashTotal < 2000) {
        animateResultCount(shaveDynamicCashTotal, newCashTotal, dynamicCashTotal)
      } else {
        dynamicCashTotal.textContent = "$" + numberWithCommas(newCashTotal)
      }
      infusionAmount.value = ""
      infusionAmount.textContent = ""
      infusionSubmitButton.disabled = true
    })
  })


  let addAccountButton = document.querySelector('.new-account')

  // let editAccountButton = document.querySelector('.edit-account')



  // modal spawn
  let modal = document.querySelector('.modal')
  let modalCloseButton = document.querySelector('.modal-close')

  addAccountButton.addEventListener('click', () => {
    modal.style.display = "block"
  })

  modalCloseButton.addEventListener('click', () => {
    modal.style.display = "none"
    // reset modal defaults on close
    accountName.value = ""
    accountPercent.value = defaultPercent
    bluePointsString.textContent = remainingPoints
  })

  window.addEventListener('click', (e) => {
    if (e.target == modal) {
      modal.style.display = "none"
    }
  })




  // modal account remaining
  let total = []
  let accounts = local_data.accounts
  accounts.forEach((account, index) => {
    total.push(account.percent)
  })
  let AllAccountsAdded = total.reduce((a, b) => a + b, 0)
  let remainingPoints = 100 - AllAccountsAdded




  // modal interface
  let topPlusButton = document.querySelector('.percentage-div .add')
  let topMinusButton = document.querySelector('.percentage-div .minus')
  let percentInputField = document.querySelector('.enter-account-percentage')
  let bluePointsString = document.querySelector('.total-points')
  let bluePointsNumber = parseInt(bluePointsString.textContent)
  let bluePointsOnSubmission = parseInt(bluePointsString.textContent)
  let liveRemainingPoints
  let defaultPercent = 1

  // on: + button
  // if input num is less than 99 and remaining points:
  // 1. increment and set input num to + 1
  // 2. set top blue num = to curr blue num - user num
  topPlusButton.addEventListener('click', (e) => {
    e.preventDefault()
    if ((percentInputField.value < 99) && (percentInputField.value < remainingPoints)) {
      percentInputField.value = parseInt(percentInputField.value) + 1

      liveRemainingPoints = bluePointsNumber - percentInputField.value
      bluePointsString.textContent = liveRemainingPoints
    }
  })

  // on: - button
  // if input num is greater than 1:
  // 1. decrement and set input num to - 1
  // 2. set top blue num = to curr blue num - user num
  topMinusButton.addEventListener('click', (e) => {
    e.preventDefault()
    if (percentInputField.value > 1) {
      percentInputField.value = parseInt(percentInputField.value) - 1

      liveRemainingPoints = bluePointsNumber - percentInputField.value
      bluePointsString.textContent = liveRemainingPoints
    }
  })

  // two restrictions:
  // numbers only and 2 character limit on keypress
  percentInputField.addEventListener('keypress', (e) => {
    let inputLength = percentInputField.value.length
    if (e.keyCode != 13) {
      if(((e.keyCode < 48) || (e.keyCode > 57)) || (inputLength >= 2)) {
        e.preventDefault()
      }
    } else if (e.keyCode == 13) {
      e.preventDefault()
      modalSubmitButton.click()
    }
    if(percentInputField.value[0] == 0) {
      percentInputField.value = ""
    }
  })

  // on: keypress in input
  // 1. update top blue num
  percentInputField.addEventListener('input', (e) => {
    liveRemainingPoints = bluePointsNumber - percentInputField.value
    bluePointsString.textContent = liveRemainingPoints
    if (liveRemainingPoints < 0) {
      modalSubmitButton.disabled = true
    } else {
      modalSubmitButton.disabled = false
    }
  })




  // modal submission
  let accountList = document.querySelector('.accounts-list')
  let createAccountForm = document.querySelector('.newAccount')
  let modalSubmitButton = document.querySelector('.submit-new-account')
  let accountName = document.querySelector('.enter-account-name')
  let accountPercent = document.querySelector('.enter-account-percentage')

  // on: submit button click
  // if top blue num > 0 and < 100:
  // 1. submit form w/ account name, percent, & remaining
  // 2. then reset modal to defaults and send new data
  // 3. then parse data and add to top of accounts list
  createAccountForm.addEventListener('submit', (e) => {
    e.preventDefault()
    if ((bluePointsOnSubmission > 0) && (bluePointsOnSubmission <= 100)) {
      fetch('/funds/new',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accountName: accountName.value,
          accountPercent: accountPercent.value,
          remainingPoints: liveRemainingPoints,
          user: local_data
        })
      })
      .then(res => {
        // reset modal
        accountName.value = ""
        accountPercent.value = defaultPercent
        return res.text()
      })
      .then(data => {
        parsedData = JSON.parse(data)
        console.log("From server: ", parsedData)

        console.log("Old remainingPoints: ", remainingPoints)
        remainingPoints = parsedData.remainingPoints
        liveRemainingPoints = remainingPoints
        bluePointsNumber = remainingPoints
        bluePointsString.textContent = remainingPoints
        console.log("New remainingPoints: ", remainingPoints)


        let accountname = parsedData.accounts[parsedData.accounts.length - 1].accountName
        let accountid = parsedData.accounts[parsedData.accounts.length - 1]._id
        let url = "http://localhost:5050/funds/accounts/" + accountid

        let a = document.createElement('a')
        let item = document.createElement('li')

        a.href = url
        a.textContent = accountname

        // get last item in array
        item.appendChild(a)
        accountList.insertBefore(item, accountList.childNodes[0])
        modal.style.display = "none"
      })
    } else if (bluePointsOnSubmission < 0) {
      alert("Account percent is exceeds remaining points!")
    } else if (bluePointsOnSubmission > 100) {
      alert("Haven't thought this one out too fully!")
    }
  })
})