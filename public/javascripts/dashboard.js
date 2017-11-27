window.addEventListener('load', () => {

  let accountListItems = [].slice.call(document.querySelectorAll('.account'))

  let accountEditItems = [].slice.call(document.querySelectorAll('.edit'))

  accountListItems.forEach(function(item, index) {
    item.addEventListener('mouseover', function() {
      item.classList.remove('turn-white')
      item.classList.add('turn-grey')
      accountEditItems[index].classList.remove('hidden')
      accountEditItems[index].classList.remove('fade-out')
      accountEditItems[index].classList.add('fade-in')
    })

    item.addEventListener('mouseleave', function() {
      item.classList.add('turn-white')
      item.classList.remove('turn-grey')
      accountEditItems[index].classList.add('hidden')
      accountEditItems[index].classList.add('fade-out')
      accountEditItems[index].classList.remove('fade-in')
    })
  })




  let dispense = document.querySelector('.input-divvy')
  let infusionAmount = document.querySelector('.injection-value')

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
      console.log("From server: ", parsedData.infusions[parsedData.infusions.length - 1])
      alert("From server: ", parsedData)
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
  })

  window.addEventListener('click', (e) => {
    if (e.target == modal) {
      modal.style.display = "none"
    }
  })



  // modal interface
  let topPlusButton = document.querySelector('.percentage-div .add')
  let topMinusButton = document.querySelector('.percentage-div .minus')
  let topInput = document.querySelector('.enter-account-percentage')

  topPlusButton.addEventListener('click', (e) => {
    e.preventDefault()
    if (topInput.value < 99) {
      topInput.value = parseInt(topInput.value) + 1
    }
  })
  topMinusButton.addEventListener('click', (e) => {
    e.preventDefault()
    if (topInput.value > 1) {
      topInput.value = parseInt(topInput.value) - 1
    }
  })

  topInput.addEventListener('keypress', (e) => {
    let inputLength = topInput.value.length
    if(((e.keyCode < 48) || (e.keyCode > 57)) || (inputLength >= 2)) {
      e.preventDefault()
    }
    if(topInput.value[0] == 0) {
      topInput.value = ""
    }
  })


  // modal submission
  let createAccountForm = document.querySelector('.newAccount')
  let accountName = document.querySelector('.enter-account-name')
  let accountPercent = document.querySelector('.enter-account-percentage')

  createAccountForm.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log('Initialize submission...')
    modal.style.display = "none"
    fetch('/funds/new',
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accountName: accountName.value,
        accountPercent: accountPercent.value,
        user: local_data
      })
    })
    .then(res => {
      return res.text()
    })
    .then(data => {
      parsedData = JSON.parse(data)
      console.log("From server: ", parsedData)
      alert("From server: ", parsedData)
    })
  })


})