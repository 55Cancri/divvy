window.onload = function() {

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

}