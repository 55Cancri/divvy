
window.addEventListener('load', () => {

  let error = document.querySelector('.error-msg')
  let success = document.querySelector('.success-msg')

  setTimeout(() => {
    if (error) {
      error.classList.add('fade-out')
    } else if (success) {
      success.classList.add('fade-out')
    }
  }, 7000)





  let dropMenu = document.querySelector('.drop-menu')
  let subMenu = document.querySelector('.sub-menu')
  let subMenuItems = [].slice.call(document.querySelectorAll('.sub-menu li'))

  if (dropMenu) {
    dropMenu.addEventListener('click', () => {
      subMenu.classList.toggle('show')
    })
  }





  let xpanel = document.querySelector('.navbar-toggle')
  let checkboxToggle = document.querySelector('#sidebar-toggler')

  xpanel.addEventListener('click', () => {
    xpanel.classList.toggle('collapsed')
    checkboxToggle.classList.toggle('slide-out')
  })


})