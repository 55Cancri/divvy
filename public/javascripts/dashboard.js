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




})
